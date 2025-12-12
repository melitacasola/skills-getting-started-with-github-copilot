from fastapi.testclient import TestClient
import pytest

from src.app import app, activities

client = TestClient(app)


def test_get_activities():
    resp = client.get("/activities")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    # key from initial in-memory data
    assert "Chess Club" in data


def test_signup_and_unregister_cycle():
    activity = "Chess Club"
    email = "test_user@example.com"

    # make sure clean start
    if email in activities[activity]["participants"]:
        activities[activity]["participants"].remove(email)

    # sign up
    resp = client.post(f"/activities/{activity}/signup?email={email}")
    assert resp.status_code == 200
    body = resp.json()
    assert "Signed up" in body.get("message", "")
    assert email in activities[activity]["participants"]

    # duplicate signup should fail
    resp_dup = client.post(f"/activities/{activity}/signup?email={email}")
    assert resp_dup.status_code == 400

    # unregister
    resp_un = client.delete(f"/activities/{activity}/unregister?email={email}")
    assert resp_un.status_code == 200
    body_un = resp_un.json()
    assert "Unregistered" in body_un.get("message", "")
    assert email not in activities[activity]["participants"]


def test_unregister_nonexistent():
    activity = "Chess Club"
    email = "no_such_user@example.com"
    # ensure not present
    if email in activities[activity]["participants"]:
        activities[activity]["participants"].remove(email)

    resp = client.delete(f"/activities/{activity}/unregister?email={email}")
    assert resp.status_code == 404


def reset_navigation():
    client.post("/navigation/reset")


def test_navigation_depends_on_changes():
    activity = "Chess Club"
    email = "nav_user@example.com"

    # ensure clean state
    reset_navigation()
    if email in activities[activity]["participants"]:
        activities[activity]["participants"].remove(email)

    resp_default = client.get("/navigation/next")
    assert resp_default.status_code == 200
    assert resp_default.json().get("next") == "/mmb"

    signup_resp = client.post(f"/activities/{activity}/signup?email={email}")
    assert signup_resp.status_code == 200

    resp_after_change = client.get("/navigation/next")
    assert resp_after_change.status_code == 200
    assert resp_after_change.json().get("next") == "/mmb/payment"

    # cleanup
    client.delete(f"/activities/{activity}/unregister?email={email}")
    reset_navigation()

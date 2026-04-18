import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_student(client: AsyncClient):
    response = await client.post(
        "/api/v1/students/",
        json={
            "name": "Test Student",
            "contact_email": "test@example.com",
            "level": "Beginner",
            "timezone": "UTC"
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Student"
    assert data["contact_email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_read_students(client: AsyncClient):
    # First create a student
    await client.post(
        "/api/v1/students/",
        json={
            "name": "Student 1",
            "level": "Beginner",
            "timezone": "UTC"
        },
    )
    
    response = await client.get("/api/v1/students/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(s["name"] == "Student 1" for s in data)

@pytest.mark.asyncio
async def test_create_student_invalid_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/students/",
        json={
            "name": "Bad Email",
            "contact_email": "not-an-email",
            "level": "Beginner",
            "timezone": "UTC"
        },
    )
    assert response.status_code == 422 # Pydantic validation error

@pytest.mark.asyncio
async def test_update_student(client: AsyncClient):
    # Create student
    res = await client.post("/api/v1/students/", json={"name": "Old Name", "level": "Beginner"})
    student_id = res.json()["id"]

    # Update
    response = await client.patch(f"/api/v1/students/{student_id}", json={"name": "New Name", "level": "Intermediate"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["level"] == "Intermediate"

@pytest.mark.asyncio
async def test_delete_student(client: AsyncClient):
    # Create student
    res = await client.post("/api/v1/students/", json={"name": "To Delete", "level": "Beginner"})
    student_id = res.json()["id"]

    # Delete
    response = await client.delete(f"/api/v1/students/{student_id}")
    assert response.status_code == 204

    # Verify deleted
    res_check = await client.get(f"/api/v1/students/{student_id}")
    assert res_check.status_code == 404

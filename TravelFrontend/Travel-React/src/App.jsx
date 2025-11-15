import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    destination: "",
    reason: "",
    priority: "",
    timeOfYear: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ Use value from .env (fallback optional)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2066";
  console.log("API BASE URL =", API_BASE_URL);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleFetch = (url, options) =>
    fetch(url, options).then((res) => {
      if (!res.ok) throw new Error("Server Issue");
      return res.json();
    });

  // Load places on page load
  useEffect(() => {
    handleFetch(`${API_BASE_URL}/all`)
      .then((data) => setPlaces(data))
      .catch(() => {
        showMessage("Backend not connected! Please start your server.");
      });
  }, [API_BASE_URL]);

  const savePlace = () => {
    if (!newPlace.destination || !newPlace.reason || !newPlace.priority || !newPlace.timeOfYear) {
      showMessage("Please fill all fields!");
      return;
    }

    if (editingId) {
      handleFetch(`${API_BASE_URL}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPlace, id: editingId }),
      })
        .then((updatedPlace) => {
          setPlaces(places.map((p) => (p.id === editingId ? updatedPlace : p)));
          setEditingId(null);
          setNewPlace({ destination: "", reason: "", priority: "", timeOfYear: "" });
          showMessage("Destination updated!");
        })
        .catch(() => showMessage("Backend not responding!"));
    } else {
      handleFetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      })
        .then((place) => {
          setPlaces([...places, place]);
          setNewPlace({ destination: "", reason: "", priority: "", timeOfYear: "" });
          showMessage("Destination added successfully!");
        })
        .catch(() => showMessage("Backend not responding!"));
    }
  };

  const deletePlace = (id) => {
    fetch(`${API_BASE_URL}/delete/${id}`, { method: "DELETE" })
      .then(() => {
        setPlaces(places.filter((p) => p.id !== id));
        showMessage("🗑 Destination deleted!");
      })
      .catch(() => showMessage("Backend not responding!"));
  };

  const editPlace = (place) => {
    setEditingId(place.id);
    setNewPlace({
      destination: place.destination,
      reason: place.reason,
      priority: place.priority,
      timeOfYear: place.timeOfYear || "",
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Travel Wishboard</h1>
        <p>Plan your dream destinations and track where you want to go next.</p>
      </header>

      {message && <div className="message">{message}</div>}

      <div className="form-card">
        <h2>{editingId ? "Edit Destination" : "Add a Destination"}</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Destination"
            value={newPlace.destination}
            onChange={(e) => setNewPlace({ ...newPlace, destination: e.target.value })}
          />

          <input
            type="text"
            placeholder="Reason to Visit"
            value={newPlace.reason}
            onChange={(e) => setNewPlace({ ...newPlace, reason: e.target.value })}
          />

          <select
            value={newPlace.priority}
            onChange={(e) => setNewPlace({ ...newPlace, priority: e.target.value })}
          >
            <option value="">Priority Level</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={newPlace.timeOfYear}
            onChange={(e) => setNewPlace({ ...newPlace, timeOfYear: e.target.value })}
          >
            <option value="">Best Time of Year</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
            <option value="Winter">Winter</option>
          </select>

          <button onClick={savePlace}>
            {editingId ? "Update Destination" : "Add Destination"}
          </button>
        </div>
      </div>

      <div className="list-container">
        <h2>My Saved Places</h2>
        {places.length === 0 ? (
          <p className="empty">No destinations yet. Start adding some!</p>
        ) : (
          <ul className="place-list">
            {places.map((p) => (
              <li key={p.id} className="place-card">
                <div className="place-info">
                  <h3>{p.destination} (ID: {p.id})</h3>
                  <p>{p.reason}</p>
                  <p>Best Time: {p.timeOfYear}</p>
                  <span className={`priority ${p.priority.toLowerCase()}`}>
                    {p.priority} Priority
                  </span>
                </div>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => editPlace(p)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deletePlace(p.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./components/button";

function App() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
    const [items, setItems] = useState([]);
    const [inputName, setInputName] = useState("");
    const [editingItem, setEditingItem] = useState(null);

    // Fetch items from the backend
    useEffect(() => {
        getItems();
    }, []);

    // Get items from the backend
    const getItems = () => {
        axios.get(`${API_BASE_URL}/api/items`).then((response) => {
            setItems(response.data);
        });
    };

    // Add a new item
    const addItem = (e) => {
        e.preventDefault();
        axios
            .post(`${API_BASE_URL}/api/items`, { name: inputName })
            .then((response) => {
                setItems([...items, response.data]);
                setInputName("");
            })
            .catch((error) => {
                console.error("Error adding item:", error);
            });
    };

    // Delete an item
    const deleteItem = (id) => {
        const originalItems = [...items];
        setItems(items.filter((item) => item.id !== id));

        axios.delete(`${API_BASE_URL}/api/items/${id}`).catch((error) => {
            console.error("Error deleting item:", error);
            // Revert to original items if there's an error
            setItems(originalItems);
        });
    };

    // Update an item
    const updateItem = (id, name) => {
        const originalItems = [...items];
        setItems(
            items.map((item) => (item.id === id ? { ...item, name } : item))
        );

        axios
            .put(`${API_BASE_URL}/api/items/${id}`, { name })
            .then((response) => {
                // Update item with data returned from server
                setItems(
                    items.map((item) => (item.id === id ? response.data : item))
                );
            })
            .catch((error) => {
                console.error("Error updating item:", error);
                // Revert to original items if there's an error
                setItems(originalItems);
            });
    };

    // Start editing an item
    const startEdit = (item) => {
        setEditingItem({ ...item });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingItem(null);
    };

    // Save edited item
    const saveEdit = () => {
        updateItem(editingItem.id, editingItem.name);
        setEditingItem(null);
    };

    return (
        <div>
            <h1>AI x Biology Hackathon</h1>

            <form onSubmit={addItem}>
                <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter item name"
                />
                <Button type="submit">Add Item</Button>
            </form>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {editingItem && editingItem.id === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) =>
                                        setEditingItem({
                                            ...editingItem,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Button onClick={saveEdit}>Save</Button>
                                <Button onClick={cancelEdit}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                {item.name}{" "}
                                <Button onClick={() => startEdit(item)}>
                                    Edit
                                </Button>
                                <Button onClick={() => deleteItem(item.id)}>
                                    Delete
                                </Button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

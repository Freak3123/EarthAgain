"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { features } from "process";

export interface IEvent {
  title: string;
  date: Date;
  time: string;
  location: string;
  district: string;
  type: string;
  attendees: string;
  description: string;
  image: string;
  featured: boolean;
}

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (result && result.error) {
      console.error("Sign-in error:", result.error);
    } else if (result) {
      console.log("Signed in successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const EventForm = () => {
  const [formData, setFormData] = useState<IEvent>({
    title: "",
    date: new Date(),
    time: "",
    location: "",
    district: "",
    type: "Exhibition",
    attendees: "",
    description: "",
    image: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (field: keyof IEvent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imagePath = formData.image;

      // Upload file only when submitting
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("title", formData.title); // 👈 pass title to API

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();

        if (uploadRes.ok) {
          imagePath = uploadJson.filePath;
        } else {
          alert("Image upload failed!");
          return;
        }
      }
      await axios.post("/api/admin/save-events", {
        ...formData,
        image: imagePath,
      });

      alert("Event created successfully!");

      setFormData({
        title: "",
        date: new Date(),
        time: "",
        location: "",
        district: "",
        type: "Exhibition",
        attendees: "",
        description: "",
        image: "",
        featured: false,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="mt-20">
      <div className="flex justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={formData.date.toISOString().split("T")[0]}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Mark as Featured
              </label>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleChange("type", e.target.value as IEvent["type"])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Exhibition">Exhibition</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => handleChange("attendees", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 2000+"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            {/* Image */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-md"
              />
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    author: "",
    date: "",
    readTime: "",
    category: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, type } = e.target;

  const value =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked 
      : e.target.value; 

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          data.append(key, value.toString()); // "true" or "false"
        }  else {
          data.append(key, value as string);
        }
      });

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await fetch("/api/admin/save-blogs", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save blog");

      setMessage("✅ Blog saved successfully!");
      setFormData({
        title: "",
        excerpt: "",
        author: "",
        date: "",
        readTime: "",
        category: "",
        featured: false,
      });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Create Blog</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="excerpt"
        placeholder="Excerpt"
        value={formData.excerpt}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          Mark as Featured
        </label>
      </div>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="readTime"
        placeholder="Read Time (e.g. 9 min read)"
        value={formData.readTime}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
          }
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      {selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="mt-2 w-full h-48 object-cover rounded-md"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Blog"}
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("");
  const { data: session, status } = useSession();
  const [events, setEvents] = useState({});
  const [blogs, setBlogs] = useState({});

  if (!session) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  const fetchLiveEvents = async () => {
    const res = await axios.get("/api/get-events");

    setEvents(res.data);
    console.log(res.data);
  };

  const fetchSavedBlogs = async () => {
    const res = await axios.get("/api/get-blogs");

    setBlogs(res.data);
  };

  return (
    <div className="flex flex-col mt-24  min-h-screen bg-gray-100">
      <div className="flex justify-center">
        <Button
          className="m-3"
          onClick={() => {
            setActiveTab("events");
            fetchLiveEvents();
          }}
        >
          Event
        </Button>
        <Button
          className="m-3"
          onClick={() => {
            setActiveTab("blog");
            fetchSavedBlogs();
          }}
        >
          Blog
        </Button>
        <Button
          className="m-3"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
      </div>

      <div>
        {activeTab === "events" ? (
          <div className="flex flex-col justify-center">
            <EventForm />
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-center">
                All Events
              </h3>
              <div className="space-y-4">
                {Array.isArray(events) && events.length > 0 ? (
                  events.map(
                    (event: IEvent & { _id?: string }, idx: number) => (
                      <div
                        key={event._id || idx}
                        className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-bold text-lg">{event.title}</div>
                          <div className="text-gray-600 text-sm">
                            {event.date
                              ? new Date(event.date).toLocaleDateString()
                              : ""}
                            {" • "}
                            {event.time}
                            {" • "}
                            {event.location}
                            {" • "}
                            {event.district}
                            {" • "}
                            {event.type}
                            {" • "}
                            {event.attendees}
                          </div>
                          <div className="text-gray-700 mt-2">
                            {event.description}
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          className="ml-4 mt-4 md:mt-0"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${event.title}"?`
                              )
                            ) {
                              try {
                                await axios.delete("/api/admin/delete-events", {
                                  data: { id: event._id },
                                });

                                const res = await axios.get("/api/get-events");
                                setEvents(res.data);
                              } catch (err) {
                                alert("Failed to delete event.");
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center text-gray-500">
                    No events found.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {activeTab === "blog" ? (
          <div className="flex flex-col justify-center">
            <BlogForm />
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-center">
                All Blogs
              </h3>
              <div className="space-y-4">
                {Array.isArray(blogs) && blogs.length > 0 ? (
                  blogs.map(
                    (
                      blog: {
                        _id?: string;
                        title: string;
                        excerpt: string;
                        author: string;
                        date?: string;
                        readTime: string;
                        category: string;
                        image?: string;
                      },
                      idx: number
                    ) => (
                      <div
                        key={blog._id || idx}
                        className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between"
                      >
                        <div className="flex-1">
                          {/* Blog Title */}
                          <div className="font-bold text-lg">{blog.title}</div>

                          {/* Blog Meta Info */}
                          <div className="text-gray-600 text-sm mt-1">
                            {blog.date
                              ? new Date(blog.date).toLocaleDateString()
                              : ""}
                            {" • "}
                            {blog.readTime}
                            {" • "}
                            {blog.category}
                            {" • "}
                            By {blog.author}
                          </div>
                        </div>

                        {/* Blog Image (if exists) */}
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="ml-4 mt-4 md:mt-0 w-32 h-20 object-cover rounded"
                          />
                        )}

                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          className="ml-4 mt-4 md:mt-0"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${blog.title}"?`
                              )
                            ) {
                              try {
                                await axios.delete("/api/admin/delete-blogs", {
                                  data: { id: blog._id },
                                });

                                const res = await axios.get("/api/get-blogs");
                                setBlogs(res.data);
                              } catch (err) {
                                alert("Failed to delete blog.");
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center text-gray-500">
                    No blogs found.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Page;

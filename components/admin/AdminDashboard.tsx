"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  CalendarDays,
  Users,
  UsersRound,
  Leaf,
  FileText,
  ClipboardList,
  LogOut,
  Loader2,
} from "lucide-react";
import { ISpeaker, ClimatePanchayatFormData } from "./shared";
import { LoginForm } from "./forms/LoginForm";
import { EventsSection } from "./sections/EventsSection";
import { RegEventsSection } from "./sections/RegEventsSection";
import { SpeakersSection } from "./sections/SpeakersSection";
import { ClimatePanchayatSection } from "./sections/ClimatePanchayatSection";
import { BlogsSection } from "./sections/BlogsSection";
import { RegistrationsList } from "./RegistrationsList";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const { data: session, status } = useSession();
  const [events, setEvents] = useState({});
  const [speakers, setSpeakers] = useState<ISpeaker[]>([]);
  const [regevents, setRegevents] = useState({});
  const [blogs, setBlogs] = useState<
    Array<{
      _id?: string;
      title: string;
      excerpt: string;
      author: string;
      date?: string;
      readTime: string;
      category: string;
      image?: string;
    }>
  >([]);
  const [climatePanchayats, setClimatePanchayats] = useState<
    ClimatePanchayatFormData[]
  >([]);
  const [regList, setRegList] = useState<any[]>([]);
  const [listSearch, setListSearch] = useState("");
  const [listLoading, setListLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fefaf2]">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          <span className="text-sm font-medium">Loading console…</span>
        </div>
      </div>
    );
  }

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
  const fetchSpeakers = async () => {
    const res = await axios.get("/api/get-speakers");
    setSpeakers(res.data);
    console.log(res.data);
  };
  const fetchClimatePanchayat = async () => {
    const res = await axios.get("/api/get-climatePanchayat");

    setClimatePanchayats(res.data);
    console.log(res.data);
  };
  const fetchSavedBlogs = async () => {
    const res = await axios.get("/api/get-blogs");

    setBlogs(res.data);
  };
  const fetchRegEvents = async () => {
    const res = await axios.get("/api/get-regEvent");
    setRegevents(res.data);
  };
  const fetchRegList = async () => {
    const res = await axios.get("/api/get-registrations");
    console.log("Fetched registrations:", res.data);
    setRegList(res.data);
  };

  const tabs = [
    { id: "events", label: "Events", icon: CalendarDays, load: fetchLiveEvents },
    {
      id: "regevents",
      label: "Reg Events",
      icon: ClipboardList,
      load: fetchRegEvents,
    },
    { id: "speakers", label: "Speakers", icon: Users, load: fetchSpeakers },
    {
      id: "climate-panchayat",
      label: "Climate Panchayat",
      icon: Leaf,
      load: fetchClimatePanchayat,
    },
    { id: "blog", label: "Blog", icon: FileText, load: fetchSavedBlogs },
    {
      id: "reglist",
      label: "Registrations",
      icon: UsersRound,
      load: fetchRegList,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefaf2] pb-24 pt-28">
      {/* Header */}
      <header className="border-y border-stone-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm shadow-green-600/20">
              <Leaf className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Admin Console
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-stone-500">
                Earth Again · Content Management
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setListSearch("");
                  setListLoading(true);
                  Promise.resolve(tab.load())
                    .catch(() => {})
                    .finally(() => setListLoading(false));
                }}
                className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        {activeTab === "" && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 py-20 text-center">
            <Leaf className="mx-auto mb-4 h-10 w-10 text-green-600/40" />
            <p className="text-lg font-semibold text-stone-700">
              Welcome to the console
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Choose a section above to manage content.
            </p>
          </div>
        )}

        {activeTab === "events" ? (
          <EventsSection
            events={events}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchLiveEvents}
          />
        ) : (
          ""
        )}

        {activeTab === "regevents" ? (
          <RegEventsSection
            regevents={regevents}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchRegEvents}
          />
        ) : (
          ""
        )}

        {activeTab === "speakers" ? (
          <SpeakersSection
            speakers={speakers}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchSpeakers}
          />
        ) : (
          ""
        )}

        {activeTab === "climate-panchayat" ? (
          <ClimatePanchayatSection
            climatePanchayats={climatePanchayats}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchClimatePanchayat}
          />
        ) : (
          ""
        )}

        {activeTab === "blog" ? (
          <BlogsSection
            blogs={blogs}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchSavedBlogs}
          />
        ) : (
          ""
        )}

        {activeTab === "reglist" ? (
          <RegistrationsList regList={regList} onRefresh={fetchRegList} />
        ) : (
          ""
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

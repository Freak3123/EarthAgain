"use client";
import { useEffect, useState } from "react";
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
  LayoutGrid,
  Inbox,
  UserPlus,
  Handshake,
  MapPin,
} from "lucide-react";
import {
  ISpeaker,
  ClimatePanchayatFormData,
  FormSettingsData,
  FormCategoryKey,
  MasterFormsToggle,
} from "./shared";
import { LoginForm } from "./forms/LoginForm";
import { EventsSection } from "./sections/EventsSection";
import { RegEventsSection } from "./sections/RegEventsSection";
import { SpeakersSection } from "./sections/SpeakersSection";
import { ClimatePanchayatSection } from "./sections/ClimatePanchayatSection";
import { BlogsSection } from "./sections/BlogsSection";
import { RegistrationsList } from "./RegistrationsList";
import { FormDataList, Column, FormRecord } from "./FormDataList";
import { ChaptersSection } from "./sections/ChaptersSection";
import { prettify, ContactCell, BadgeList } from "./cells";
import SubsiteBuilder from "./builder/SubsiteBuilder";

type TabGroup = "content" | "forms";

const AdminDashboard = () => {
  const [activeGroup, setActiveGroup] = useState<TabGroup>("content");
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
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [listSearch, setListSearch] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [formSettings, setFormSettings] = useState<FormSettingsData | null>(
    null
  );
  const [formSettingsBusy, setFormSettingsBusy] = useState(false);

  useEffect(() => {
    const fetchFormSettings = async () => {
      try {
        const res = await axios.get("/api/form-settings");
        setFormSettings(res.data);
      } catch {
        // Toggles simply won't render until this loads.
      }
    };
    fetchFormSettings();
  }, []);

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

  // Two experiences behind one role-aware /admin (design §2/§4): subadmins get
  // their scoped sub-site builder; everything below this point is the
  // superadmin console, unchanged.
  if (session.user.role === "subadmin") {
    return <SubsiteBuilder />;
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
  const fetchVolunteers = async () => {
    const res = await axios.get("/api/get-volunteers");
    setVolunteers(res.data);
  };
  const fetchPartners = async () => {
    const res = await axios.get("/api/get-partners");
    setPartners(res.data);
  };
  const fetchChapters = async () => {
    const res = await axios.get("/api/get-chapters");
    setChapters(res.data);
  };

  const updateFormSetting = async (
    field: "masterLive" | FormCategoryKey,
    value: boolean
  ) => {
    if (!formSettings) return;
    const prev = formSettings;
    setFormSettingsBusy(true);
    setFormSettings({ ...formSettings, [field]: value });
    try {
      const res = await axios.patch("/api/admin/form-settings", {
        field,
        value,
      });
      setFormSettings(res.data);
    } catch {
      setFormSettings(prev);
      alert("Failed to update form settings.");
    } finally {
      setFormSettingsBusy(false);
    }
  };

  const liveToggleFor = (field: FormCategoryKey, label: string) =>
    formSettings
      ? {
          label,
          live: formSettings[field],
          masterLive: formSettings.masterLive,
          busy: formSettingsBusy,
          onToggle: () => updateFormSetting(field, !formSettings[field]),
        }
      : undefined;

  // Content Management: pages managed/authored by admins.
  const contentTabs = [
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
  ];

  // Form Data: submissions collected from the public site.
  const formTabs = [
    {
      id: "reglist",
      label: "Registrations",
      icon: UsersRound,
      load: fetchRegList,
    },
    { id: "volunteers", label: "Volunteers", icon: UserPlus, load: fetchVolunteers },
    { id: "partners", label: "Partners", icon: Handshake, load: fetchPartners },
    { id: "chapters", label: "Chapters", icon: MapPin, load: fetchChapters },
  ];

  const groups = [
    { id: "content" as const, label: "Content Management", icon: LayoutGrid },
    { id: "forms" as const, label: "Form Data", icon: Inbox },
  ];

  const tabs = activeGroup === "content" ? contentTabs : formTabs;

  const switchGroup = (group: TabGroup) => {
    setActiveGroup(group);
    setActiveTab("");
    setListSearch("");
  };

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

      {/* Master forms live/paused switch — Form Data tab only */}
      {activeGroup === "forms" && formSettings && (
        <MasterFormsToggle
          live={formSettings.masterLive}
          busy={formSettingsBusy}
          onToggle={() =>
            updateFormSetting("masterLive", !formSettings.masterLive)
          }
        />
      )}

      {/* Group toggle */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="inline-flex gap-1 rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-sm">
          {groups.map((group) => {
            const Icon = group.icon;
            const active = activeGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => switchGroup(group.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {group.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab navigation */}
      <nav className="mx-auto max-w-6xl px-6 pt-4">
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
          <RegistrationsList
            regList={regList}
            onRefresh={fetchRegList}
            liveToggle={liveToggleFor("registration", "Registration form")}
          />
        ) : (
          ""
        )}

        {activeTab === "volunteers" ? (
          <FormDataList
            title="Volunteers"
            statLabel="Total volunteers"
            statIcon={UserPlus}
            items={volunteers}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchVolunteers}
            liveToggle={liveToggleFor("volunteer", "Volunteer form")}
            deleteEndpoint="/api/admin/delete-volunteer"
            csvName="volunteers.csv"
            getLabel={(v) => (v.name as string) || "this volunteer"}
            searchFields={(v) => [
              v.name as string,
              v.email as string,
              v.phone as string,
            ]}
            columns={
              [
                {
                  header: "Name",
                  cell: (v) => v.name as string,
                  csv: (v) => (v.name as string) || "",
                },
                {
                  header: "Contact",
                  cell: (v) => (
                    <ContactCell
                      email={v.email as string}
                      phone={v.phone as string}
                    />
                  ),
                  csv: (v) => `${v.email ?? ""} / ${v.phone ?? ""}`,
                },
                {
                  header: "Age",
                  cell: (v) => prettify(v.age as string),
                  csv: (v) => (v.age as string) || "",
                },
                {
                  header: "Skills",
                  cell: (v) => <BadgeList items={v.skills as string[]} />,
                  csv: (v) => ((v.skills as string[]) || []).join("; "),
                },
                {
                  header: "Availability",
                  cell: (v) => prettify(v.availability as string),
                  csv: (v) => (v.availability as string) || "",
                },
              ] as Column<FormRecord>[]
            }
          />
        ) : (
          ""
        )}

        {activeTab === "partners" ? (
          <FormDataList
            title="Partners"
            statLabel="Total partners"
            statIcon={Handshake}
            items={partners}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchPartners}
            liveToggle={liveToggleFor("partner", "Partner form")}
            deleteEndpoint="/api/admin/delete-partner"
            csvName="partners.csv"
            getLabel={(p) => (p.organizationName as string) || "this partner"}
            searchFields={(p) => [
              p.organizationName as string,
              p.contactName as string,
              p.contactEmail as string,
              p.contactPhone as string,
            ]}
            columns={
              [
                {
                  header: "Organization",
                  cell: (p) => (
                    <div>
                      <div>{p.organizationName as string}</div>
                      <div className="text-xs text-stone-500">
                        {prettify(p.organizationType as string)}
                      </div>
                    </div>
                  ),
                  csv: (p) =>
                    `${p.organizationName ?? ""} (${prettify(
                      p.organizationType as string
                    )})`,
                },
                {
                  header: "Contact",
                  cell: (p) => (
                    <div>
                      <div className="text-stone-700">
                        {p.contactName as string}
                        {p.contactDesignation ? (
                          <span className="text-stone-400">
                            {" "}
                            · {p.contactDesignation as string}
                          </span>
                        ) : null}
                      </div>
                      <ContactCell
                        email={p.contactEmail as string}
                        phone={p.contactPhone as string}
                      />
                    </div>
                  ),
                  csv: (p) =>
                    `${p.contactName ?? ""} (${p.contactDesignation ?? ""}) ${
                      p.contactEmail ?? ""
                    } / ${p.contactPhone ?? ""}`,
                },
                {
                  header: "Partnership",
                  cell: (p) => (
                    <BadgeList items={p.partnershipTypes as string[]} />
                  ),
                  csv: (p) =>
                    ((p.partnershipTypes as string[]) || []).join("; "),
                },
                {
                  header: "Description",
                  cell: (p) => (
                    <span
                      className="block max-w-[220px] truncate"
                      title={p.description as string}
                    >
                      {(p.description as string) || "—"}
                    </span>
                  ),
                  csv: (p) => (p.description as string) || "",
                },
                {
                  header: "Proposal",
                  cell: (p) => (
                    <span
                      className="block max-w-[220px] truncate"
                      title={p.proposal as string}
                    >
                      {(p.proposal as string) || "—"}
                    </span>
                  ),
                  csv: (p) => (p.proposal as string) || "",
                },
              ] as Column<FormRecord>[]
            }
          />
        ) : (
          ""
        )}

        {activeTab === "chapters" ? (
          <ChaptersSection
            chapters={chapters}
            loading={listLoading}
            search={listSearch}
            onSearch={setListSearch}
            onRefresh={fetchChapters}
            liveToggle={liveToggleFor("chapter", "Chapter form")}
          />
        ) : (
          ""
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;

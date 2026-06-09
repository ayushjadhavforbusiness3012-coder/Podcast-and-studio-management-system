import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { PlayCircle, CheckCircle2, Clock, FileEdit, Trash2, Plus, Filter, RotateCcw, Eye, Pencil, Mic2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext, type Episode } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { EpisodeFormDialog } from "@/components/EpisodeFormDialog";
import { EpisodeDetailsDialog } from "@/components/EpisodeDetailsDialog";


export const Route = createFileRoute("/episodes")({
  head: () => ({ meta: [{ title: "Episodes — Podcast Studio" }] }),
  component: Episodes,
});

function Episodes() {
  const { episodes, deleteEpisode, formatDate, formatTime } = useAppContext();

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [tempShow, setTempShow] = useState("All Shows");
  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempDate, setTempDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState("All Shows");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [publishedDateFilter, setPublishedDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (e: Episode) => {
    setSelectedEpisode(e);
    setFormOpen(true);
  };
  
  const handleView = (e: Episode) => {
    setSelectedEpisode(e);
    setDetailsOpen(true);
  };
  
  const handleNew = () => {
    setSelectedEpisode(null);
    setFormOpen(true);
  };

  const handleApplyFilters = () => {
    setSearchQuery(tempSearchQuery);
    setShowFilter(tempShow);
    setStatusFilter(tempStatus);
    setPublishedDateFilter(tempDate);
    setCurrentPage(1);
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setTempSearchQuery("");
    setTempShow("All Shows");
    setTempStatus("All Status");
    setTempDate("");
    setSearchQuery("");
    setShowFilter("All Shows");
    setStatusFilter("All Status");
    setPublishedDateFilter("");
    setCurrentPage(1);
    toast.info("Filters reset");
  };

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.guest.toLowerCase().includes(q);
      const matchesShow = showFilter === "All Shows" || e.show === showFilter;
      const matchesStatus = statusFilter === "All Status" || e.status === statusFilter;
      
      let matchesDate = true;
      if (publishedDateFilter) {
        try {
          const eDate = new Date(e.publishedDate || "");
          const fDate = new Date(publishedDateFilter);
          matchesDate = eDate.getFullYear() === fDate.getFullYear() &&
                        eDate.getMonth() === fDate.getMonth() &&
                        eDate.getDate() === fDate.getDate();
        } catch {
          matchesDate = false;
        }
      }
      return matchesSearch && matchesShow && matchesStatus && matchesDate;
    });
  }, [episodes, searchQuery, showFilter, statusFilter, publishedDateFilter]);

  const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
  const paginatedEpisodes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEpisodes.slice(start, start + itemsPerPage);
  }, [filteredEpisodes, currentPage, itemsPerPage]);

  // Unique shows for dropdown
  const shows = ["All Shows", ...new Set(episodes.map(e => e.show))];

  return (
    <DashboardLayout
      title="Episodes / Shows Management"
      subtitle="Create, manage and organize all podcast episodes"
      actions={
        <>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90">
            <Plus className="size-4" /> Add New Episode
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={PlayCircle} label="Total Episodes" value={episodes.length.toString()} trend="All local records" tone="primary" />
        <StatCard icon={CheckCircle2} label="Published" value={episodes.filter(e => e.status === "Published").length.toString()} trend="Published records" tone="success" />
        <StatCard icon={Clock} label="Scheduled" value={episodes.filter(e => e.status === "Scheduled").length.toString()} trend="Scheduled records" tone="warning" />
        <StatCard icon={FileEdit} label="Drafts" value={episodes.filter(e => e.status === "Draft").length.toString()} trend="Draft records" tone="info" />
        <StatCard icon={Trash2} label="Archived" value={episodes.filter(e => e.status === "Archived").length.toString()} trend="Archived records" tone="destructive" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground" htmlFor="search-episodes">Search Episodes</label>
            <input 
              id="search-episodes"
              placeholder="Search by title or guest..." 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" 
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              title="Search by title or guest"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="select-show">Show / Series</label>
            <select 
              id="select-show"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={tempShow}
              onChange={(e) => setTempShow(e.target.value)}
              title="Select show or series"
            >
              {shows.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="select-status">Status</label>
            <select 
              id="select-status"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              title="Select status"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Scheduled</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold" htmlFor="select-pubdate">Published Date</label>
            <input 
              id="select-pubdate"
              type="date"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={tempDate}
              onChange={(e) => {
                setTempDate(e.target.value);
              }}
              title="Select published date"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleApplyFilters} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm">
              <Filter className="size-4" /> Filter
            </button>
            <button 
              onClick={handleReset} 
              className="h-10 w-10 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Reset Filters"
              aria-label="Reset Filters"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 text-left font-medium">Episode</th>
                <th className="p-4 text-left font-medium">Show / Series</th>
                <th className="p-4 text-left font-medium">Guest</th>
                <th className="p-4 text-left font-medium">Duration</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Published Date</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEpisodes.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-12 rounded-lg ${e.color} grid place-items-center text-white relative`}>
                        <Mic2 className="size-5" />
                        <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/40 px-1 rounded">EP #{e.ep}</span>
                      </div>
                      <div>
                        <div className="font-medium max-w-[200px] truncate">{e.title}</div>
                        <div className="text-xs text-muted-foreground">Episode #{e.ep}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{e.show}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/64?img=${e.img}`} className="size-8 rounded-full" alt="" />
                      <span>{e.guest}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground"><Clock className="size-3.5 inline mr-1" />{e.dur}</td>
                  <td className="p-4"><Badge variant={e.sv}>{e.status}</Badge></td>
                  <td className="p-4">
                    {e.date === "—" ? <span className="text-muted-foreground">—</span> : (
                      <div>
                        <div>{formatDate(e.publishedDate || e.date)}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(e.time)}</div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(e)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors cursor-pointer" title="View details"><Eye className="size-4" /></button>
                      <button onClick={() => handleEdit(e)} className="size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors cursor-pointer" title="Edit episode"><Pencil className="size-4" /></button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete episode "${e.title}"?`)) {
                            deleteEpisode(e.id);
                            toast.success("Episode deleted successfully!");
                          }
                        }}
                        className="size-8 rounded-md border border-border grid place-items-center text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete episode"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEpisodes.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No episodes found matching your filters.
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4 text-sm border-t border-border flex-wrap gap-2">
          <div className="text-muted-foreground">
            Showing {Math.min(filteredEpisodes.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredEpisodes.length, currentPage * itemsPerPage)} of {filteredEpisodes.length} episodes
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`size-8 rounded-md text-xs font-semibold cursor-pointer ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground font-bold"
                    : "border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title={`Page ${p}`}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      
      <EpisodeFormDialog open={formOpen} onOpenChange={setFormOpen} episodeToEdit={selectedEpisode || undefined} />
      <EpisodeDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} episode={selectedEpisode} />
    </DashboardLayout>
  );
}

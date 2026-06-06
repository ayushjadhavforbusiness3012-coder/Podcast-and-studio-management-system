import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, StatCard, Badge } from "@/components/DashboardLayout";
import { PlayCircle, CheckCircle2, Clock, FileEdit, Trash2, Plus, Search, Filter, RotateCcw, Eye, Pencil, MoreVertical, Mic2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext, type Episode } from "@/contexts/AppContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { EpisodeFormDialog } from "@/components/EpisodeFormDialog";
import { EpisodeDetailsDialog } from "@/components/EpisodeDetailsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/episodes")({
  head: () => ({ meta: [{ title: "Episodes — Podcast Studio" }] }),
  component: Episodes,
});

function Episodes() {
  const { episodes, deleteEpisode } = useAppContext();

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState("All Shows");
  const [statusFilter, setStatusFilter] = useState("All Status");

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

  const handleReset = () => {
    setSearchQuery("");
    setShowFilter("All Shows");
    setStatusFilter("All Status");
    toast.info("Filters reset");
  };

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || e.title.toLowerCase().includes(q) || e.guest.toLowerCase().includes(q);
      const matchesShow = showFilter === "All Shows" || e.show === showFilter;
      const matchesStatus = statusFilter === "All Status" || e.status === statusFilter;
      return matchesSearch && matchesShow && matchesStatus;
    });
  }, [episodes, searchQuery, showFilter, statusFilter]);

  // Unique shows for dropdown
  const shows = ["All Shows", ...new Set(episodes.map(e => e.show))];

  return (
    <DashboardLayout
      title="Episodes / Shows Management"
      subtitle="Create, manage and organize all podcast episodes"
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Search episodes..." 
              className="h-10 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={handleNew} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90">
            <Plus className="size-4" /> Add New Episode
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={PlayCircle} label="Total Episodes" value={episodes.length.toString()} trend="↑ 12% from last month" tone="primary" />
        <StatCard icon={CheckCircle2} label="Published" value={episodes.filter(e => e.status === "Published").length.toString()} trend="67% of total" tone="success" />
        <StatCard icon={Clock} label="Scheduled" value={episodes.filter(e => e.status === "Scheduled").length.toString()} trend="16% of total" tone="warning" />
        <StatCard icon={FileEdit} label="Drafts" value={episodes.filter(e => e.status === "Draft").length.toString()} trend="12% of total" tone="info" />
        <StatCard icon={Trash2} label="Archived" value={episodes.filter(e => e.status === "Archived").length.toString()} trend="5% of total" tone="destructive" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground">Search Episodes</label>
            <input 
              placeholder="Search by title or guest..." 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Show / Series</label>
            <select 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={showFilter}
              onChange={(e) => setShowFilter(e.target.value)}
            >
              {shows.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <select 
              className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Scheduled</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Published Date</label>
            <select className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm">
              <option>All Time</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast.success("Filters applied")} className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5 hover:opacity-90">
              <Filter className="size-4" /> Filter
            </button>
            <button onClick={handleReset} className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
              {filteredEpisodes.map((e) => (
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
                        <div>{e.date}</div>
                        <div className="text-xs text-muted-foreground">{e.time}</div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(e)} className="size-8 rounded-md border border-border grid place-items-center text-info hover:bg-info/10 transition-colors"><Eye className="size-4" /></button>
                      <button onClick={() => handleEdit(e)} className="size-8 rounded-md border border-border grid place-items-center text-warning-foreground hover:bg-warning/10 transition-colors"><Pencil className="size-4" /></button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-accent"><MoreVertical className="size-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(e)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(e)}>Edit Episode</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => {
                              deleteEpisode(e.id);
                              toast.success(`Episode deleted`);
                            }}
                          >
                            <Trash2 className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <div className="flex items-center justify-between p-4 text-sm border-t border-border">
          <div className="text-muted-foreground">Showing {filteredEpisodes.length} of {episodes.length} episodes</div>
          <div className="flex items-center gap-1">
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronLeft className="size-4" /></button>
            <button className="size-8 rounded-md bg-primary text-primary-foreground">1</button>
            <button className="size-8 rounded-md border border-border hover:bg-muted">2</button>
            <button className="size-8 rounded-md border border-border grid place-items-center hover:bg-muted"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </div>
      
      <EpisodeFormDialog open={formOpen} onOpenChange={setFormOpen} episodeToEdit={selectedEpisode || undefined} />
      <EpisodeDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} episode={selectedEpisode} />
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  action: string;
  created_at: string;
  old_value: any;
  new_value: any;
  task_id: string;
}

export const TaskHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('task_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_history'
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("task_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setHistory(data);
    }
    setLoading(false);
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      created: "default",
      updated: "secondary",
      deleted: "destructive",
      status_changed: "default",
    };

    return (
      <Badge variant={variants[action] || "default"} className="capitalize">
        {action.replace("_", " ")}
      </Badge>
    );
  };

  const renderValue = (value: any) => {
    if (!value) return null;

    return (
      <div className="space-y-1">
        {value.title && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Title: </span>
            <span className="text-sm">{value.title}</span>
          </div>
        )}
        {value.description && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Description: </span>
            <span className="text-sm">{value.description}</span>
          </div>
        )}
        {value.status && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Status: </span>
            <Badge variant="outline" className="text-xs">{value.status}</Badge>
          </div>
        )}
        {value.priority && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Priority: </span>
            <Badge variant="secondary" className="text-xs">{value.priority}</Badge>
          </div>
        )}
        {value.due_date && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Due Date: </span>
            <span className="text-sm">{format(new Date(value.due_date), "MMM dd, yyyy")}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Loading history...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Task History
        </h2>
        <p className="text-muted-foreground">
          Track all changes made to your tasks
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {history.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No history yet. Start creating and editing tasks!
            </Card>
          ) : (
            history.map((entry) => (
              <Card key={entry.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  {getActionBadge(entry.action)}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.created_at), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                
                {entry.old_value && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Previous:</p>
                    {renderValue(entry.old_value)}
                  </div>
                )}
                
                {entry.new_value && (
                  <div className="rounded-md bg-primary/5 p-3 border border-primary/10">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">New:</p>
                    {renderValue(entry.new_value)}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
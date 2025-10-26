import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Video, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Video {
  [key: string]: any;
  id: string;
  title: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: Video[];
}

export const VideoScheduler = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const { data, error } = await supabase
      .from("youtube_playlists")
      .insert([{
        name: playlistName,
        description: playlistDesc,
        videos: [],
        user_id: user.id,
      }])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create playlist");
      return;
    }

    setPlaylists([...playlists, { ...data, videos: [] }]);
    setPlaylistName("");
    setPlaylistDesc("");
    toast.success("Playlist created!");
  };

  const addVideoToPlaylist = async () => {
    if (!selectedPlaylist || !videoUrl.trim()) {
      toast.error("Please select a playlist and enter a video URL");
      return;
    }

    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    const playlist = playlists.find((p) => p.id === selectedPlaylist);
    if (!playlist) return;

    const newVideo: Video = {
      id: videoId,
      title: `Video ${playlist.videos.length + 1}`,
      url: videoUrl,
    };

    const updatedVideos = [...playlist.videos, newVideo];

    const { error } = await supabase
      .from("youtube_playlists")
      .update({ videos: updatedVideos })
      .eq("id", selectedPlaylist);

    if (error) {
      toast.error("Failed to add video");
      return;
    }

    setPlaylists(
      playlists.map((p) =>
        p.id === selectedPlaylist ? { ...p, videos: updatedVideos } : p
      )
    );
    setVideoUrl("");
    toast.success("Video added to playlist!");
  };

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const removeVideo = async (playlistId: string, videoId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    const updatedVideos = playlist.videos.filter((v) => v.id !== videoId);

    const { error } = await supabase
      .from("youtube_playlists")
      .update({ videos: updatedVideos })
      .eq("id", playlistId);

    if (error) {
      toast.error("Failed to remove video");
      return;
    }

    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId ? { ...p, videos: updatedVideos } : p
      )
    );
    toast.success("Video removed");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Video Scheduler
        </h2>
        <p className="text-muted-foreground">
          Create playlists and organize your YouTube watch later videos
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Create New Playlist</Label>
          <Input
            placeholder="Playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={playlistDesc}
            onChange={(e) => setPlaylistDesc(e.target.value)}
            rows={2}
          />
          <Button onClick={createPlaylist} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
        </div>
      </Card>

      {playlists.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Add Video to Playlist</Label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={selectedPlaylist || ""}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
            >
              <option value="">Select a playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="YouTube video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button onClick={addVideoToPlaylist} className="w-full">
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="p-4">
              <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
              {playlist.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {playlist.description}
                </p>
              )}
              <div className="space-y-2">
                {playlist.videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No videos in this playlist yet
                  </p>
                ) : (
                  playlist.videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          {video.title}
                        </a>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVideo(playlist.id, video.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
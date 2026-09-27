import { SupabaseClient } from "@supabase/supabase-js";
import { getBrowserClient } from "./supabase-browser";
import { getServerClient } from "./supabase-server";

/**
 * Type definitions for database tables
 */

export interface Profile {
  id: string;
  nickname: string;
  age_group?: string;
  gender?: string;
  style?: string;
  bio?: string;
  is_adult: boolean;
  adult_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MatePost {
  id: string;
  title: string;
  country: string;
  region?: string;
  start_date: string;
  end_date: string;
  recruitment_count: number;
  description?: string;
  status: "OPEN" | "CLOSED" | "FULL";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface ParticipationRequest {
  id: string;
  mate_post_id: string;
  requester_id: string;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  user_id: string;
  blocked_user_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  target_type: "mate_post" | "profile" | "participation_request";
  target_id: string;
  reporter_id: string;
  reason: string;
  status: "OPEN" | "REVIEWING" | "RESOLVED" | "DISMISSED";
  resolution_reason?: string;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalUrl {
  id: string;
  key: "flight" | "hotel" | "sns";
  url: string;
  updated_by?: string;
  updated_at: string;
}

/**
 * Database operations using client-side Supabase
 * Subject to RLS policies
 */

export class ClientDB {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client = client || getBrowserClient();
  }

  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as Profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await this.client
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Mate Posts
  async getMatePost(postId: string) {
    const { data, error } = await this.client
      .from("mate_posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return data as MatePost;
  }

  async listMatePosts(filters?: { country?: string; status?: string }) {
    let query = this.client.from("mate_posts").select("*");

    if (filters?.country) {
      query = query.eq("country", filters.country);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as MatePost[];
  }

  async createMatePost(post: Omit<MatePost, "id" | "created_at" | "updated_at">) {
    const { data, error } = await this.client
      .from("mate_posts")
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data as MatePost;
  }

  async updateMatePost(postId: string, updates: Partial<MatePost>) {
    const { data, error } = await this.client
      .from("mate_posts")
      .update(updates)
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return data as MatePost;
  }

  async deleteMatePost(postId: string) {
    const { error } = await this.client.from("mate_posts").delete().eq("id", postId);

    if (error) throw error;
  }

  // Participation Requests
  async getParticipationRequest(requestId: string) {
    const { data, error } = await this.client
      .from("participation_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) throw error;
    return data as ParticipationRequest;
  }

  async listParticipationRequests(filters?: { mate_post_id?: string; requester_id?: string }) {
    let query = this.client.from("participation_requests").select("*");

    if (filters?.mate_post_id) {
      query = query.eq("mate_post_id", filters.mate_post_id);
    }
    if (filters?.requester_id) {
      query = query.eq("requester_id", filters.requester_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ParticipationRequest[];
  }

  async createParticipationRequest(
    request: Omit<ParticipationRequest, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await this.client
      .from("participation_requests")
      .insert([request])
      .select()
      .single();

    if (error) throw error;
    return data as ParticipationRequest;
  }

  async updateParticipationRequestStatus(
    requestId: string,
    status: ParticipationRequest["status"]
  ) {
    const { data, error } = await this.client
      .from("participation_requests")
      .update({ status })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data as ParticipationRequest;
  }

  // Blocks
  async listMyBlocks(userId: string) {
    const { data, error } = await this.client
      .from("blocks")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data as Block[];
  }

  async blockUser(userId: string, blockedUserId: string) {
    const { data, error } = await this.client
      .from("blocks")
      .insert([{ user_id: userId, blocked_user_id: blockedUserId }])
      .select()
      .single();

    if (error) throw error;
    return data as Block;
  }

  async unblockUser(userId: string, blockedUserId: string) {
    const { error } = await this.client
      .from("blocks")
      .delete()
      .eq("user_id", userId)
      .eq("blocked_user_id", blockedUserId);

    if (error) throw error;
  }

  // Reports
  async submitReport(
    report: Omit<Report, "id" | "created_at" | "updated_at" | "status">
  ) {
    const { data, error } = await this.client
      .from("reports")
      .insert([{ ...report, status: "OPEN" }])
      .select()
      .single();

    if (error) throw error;
    return data as Report;
  }

  async listMyReports(userId: string) {
    const { data, error } = await this.client
      .from("reports")
      .select("*")
      .eq("reporter_id", userId);

    if (error) throw error;
    return data as Report[];
  }
}

/**
 * Database operations using server-side Supabase
 * Can bypass RLS when needed for admin operations
 */

export class ServerDB {
  private client: SupabaseClient;

  private constructor(client: SupabaseClient) {
    this.client = client;
  }

  static async create() {
    const client = await getServerClient();
    return new ServerDB(client);
  }

  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as Profile;
  }

  async createProfile(profile: Omit<Profile, "created_at" | "updated_at">) {
    const { data, error } = await this.client
      .from("profiles")
      .insert([profile])
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Mate Posts - Admin operations
  async listAllMatePosts() {
    const { data, error } = await this.client.from("mate_posts").select("*");

    if (error) throw error;
    return data as MatePost[];
  }

  // Reports - Admin operations
  async listAllReports(filters?: { status?: string }) {
    let query = this.client.from("reports").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Report[];
  }

  async updateReportStatus(reportId: string, updates: Partial<Report>) {
    const { data, error } = await this.client
      .from("reports")
      .update(updates)
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;
    return data as Report;
  }
}

// Convenience exports
export const db = {
  client: ClientDB,
  server: ServerDB,
};

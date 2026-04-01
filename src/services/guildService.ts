import { api } from '../lib/api';

export const guildService = {
  async fetchGuild(guildId: string): Promise<Guild> {
    const res = await api.get<Guild>(`/guilds/${guildId}`);
    return res.data;
  },

  async fetchUsage(guildId: string): Promise<UsageStats> {
    const res = await api.get<UsageStats>(`/guilds/${guildId}/usage`);
    return res.data;
  },

  async fetchUsageHistory(guildId: string, days: number): Promise<{ date: string; tokens_used: number }[]> {
    const res = await api.get<{ date: string; tokens_used: number }[]>(
      `/guilds/${guildId}/usage/history`,
      { params: { days } },
    );
    return res.data;
  },

  async fetchUsageLogs(
    guildId: string,
    limit: number,
  ): Promise<{ timestamp: string; tokens_used: number; low_confidence: boolean }[]> {
    const res = await api.get<{ timestamp: string; tokens_used: number; low_confidence: boolean }[]>(
      `/guilds/${guildId}/usage/logs`,
      { params: { limit } },
    );
    return res.data;
  },

  async fetchKnowledge(guildId: string): Promise<KnowledgeEntry[]> {
    const res = await api.get<KnowledgeEntry[]>(`/guilds/${guildId}/knowledge`);
    return res.data;
  },

  async updateGuild(
    guildId: string,
    payload: { system_prompt?: string; embed_color?: string },
  ) {
    return api.patch(`/guilds/${guildId}`, payload);
  },

  async createKnowledge(
    guildId: string,
    payload: {
      title: string;
      content?: string;
      main_content?: string;
      additional_context?: string;
      behavior_notes?: string;
    },
  ) {
    return api.post(`/guilds/${guildId}/knowledge`, payload);
  },

  async updateKnowledge(
    guildId: string,
    payload: {
      id: string;
      title?: string;
      content?: string;
      main_content?: string;
      additional_context?: string;
      behavior_notes?: string;
    },
  ) {
    const { id, ...body } = payload;
    return api.put(`/guilds/${guildId}/knowledge/${id}`, {
      ...body,
    });
  },

  async deleteKnowledge(guildId: string, id: string) {
    return api.delete(`/guilds/${guildId}/knowledge/${id}`);
  },
};
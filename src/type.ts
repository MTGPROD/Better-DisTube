import type ytdl from "@distube/ytdl-core";
import type {
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  Interaction,
  Message,
  Snowflake,
  User,
  VoiceBasedChannel,
  VoiceState,
} from "discord.js";
import type { CustomPlugin, DisTubeVoice, ExtractorPlugin, Playlist, Queue, SearchResult, Song } from ".";

export type Awaitable<T = any> = T | PromiseLike<T>;

export type DisTubeVoiceEvents = {
  disconnect: (error?: Error) => Awaitable;
  error: (error: Error) => Awaitable;
  finish: () => Awaitable;
};

export type DisTubeEvents = {
  error: (channel: GuildTextBasedChannel | undefined, error: Error) => Awaitable;
  addList: (queue: Queue, playlist: Playlist) => Awaitable;
  addSong: (queue: Queue, song: Song) => Awaitable;
  playSong: (queue: Queue, song: Song) => Awaitable;
  finishSong: (queue: Queue, song: Song) => Awaitable;
  empty: (queue: Queue) => Awaitable;
  finish: (queue: Queue) => Awaitable;
  initQueue: (queue: Queue) => Awaitable;
  noRelated: (queue: Queue) => Awaitable;
  disconnect: (queue: Queue) => Awaitable;
  deleteQueue: (queue: Queue) => Awaitable;
  searchCancel: (message: Message<true>, query: string) => Awaitable;
  searchNoResult: (message: Message<true>, query: string) => Awaitable;
  searchDone: (message: Message<true>, answer: Message<true>, query: string) => Awaitable;
  searchInvalidAnswer: (message: Message<true>, answer: Message<true>, query: string) => Awaitable;
  searchResult: (message: Message<true>, results: SearchResult[], query: string) => Awaitable;
};

/**
 * An FFmpeg audio filter object
 * ```
 * {
 *   name:  "bassboost",
 *   value: "bass=g=10"
 * }
 * ```
 * @typedef {Object} Filter
 * @prop {string} name Name of the filter
 * @prop {string} value FFmpeg audio filter(s)
 */
export interface Filter {
  name: string;
  value: string;
}

/**
 * Data that resolves to give an FFmpeg audio filter. This can be:
 * - A name of a default filters or custom filters (`string`)
 * - A {@link Filter} object
 * @typedef {string|Filter} FilterResolvable
 * @see {@link defaultFilters}
 * @see {@link DisTubeOptions|DisTubeOptions.customFilters}
 */
export type FilterResolvable = string | Filter;

/**
 * FFmpeg Filters
 * ```
 * {
 *   "Filter Name": "Filter Value",
 *   "bassboost":   "bass=g=10"
 * }
 * ```
 * @typedef {Object.<string, string>} Filters
 * @see {@link defaultFilters}
 */
export type Filters = Record<string, string>;

/**
 * DisTube options.
 * @typedef {Object} DisTubeOptions
 * @prop {Array<CustomPlugin|ExtractorPlugin>} [plugins] DisTube plugins.
 * @prop {boolean} [emitNewSongOnly=false] Whether or not emitting {@link DisTube#event:playSong} event
 * when looping a song or next song is the same as the previous one
 * @prop {boolean} [leaveOnEmpty=true] Whether or not leaving voice channel
 * if the voice channel is empty after {@link DisTubeOptions}.emptyCooldown seconds.
 * @prop {boolean} [leaveOnFinish=false] Whether or not leaving voice channel when the queue ends.
 * @prop {boolean} [leaveOnStop=true] Whether or not leaving voice channel after using {@link DisTube#stop} function.
 * @prop {boolean} [savePreviousSongs=true] Whether or not saving the previous songs of the queue
 * and enable {@link DisTube#previous} method
 * @prop {number} [searchSongs=0] Limit of search results emits in {@link DisTube#event:searchResult} event
 * when {@link DisTube#play} method executed. If `searchSongs <= 1`, play the first result
 * @prop {string} [youtubeCookie] YouTube cookies. Read how to get it in
 * {@link https://github.com/fent/node-ytdl-core/blob/997efdd5dd9063363f6ef668bb364e83970756e7/example/cookies.js#L6-L12|YTDL's Example}
 * @prop {string} [youtubeIdentityToken] If not given; ytdl-core will try to find it.
 * You can find this by going to a video's watch page; viewing the source; and searching for "ID_TOKEN".
 * @prop {Filters} [customFilters] Override {@link defaultFilters} or add more ffmpeg filters.
 * Example=`{ "Filter name"="Filter value"; "8d"="apulsator=hz=0.075" }`
 * @prop {ytdl.getInfoOptions} [ytdlOptions] `ytdl-core` get info options
 * @prop {number} [searchCooldown=60] Built-in search cooldown in seconds (When searchSongs is bigger than 0)
 * @prop {number} [emptyCooldown=60] Built-in leave on empty cooldown in seconds (When leaveOnEmpty is true)
 * @prop {boolean} [nsfw=false] Whether or not playing age-restricted content
 * and disabling safe search in non-NSFW channel.
 * @prop {boolean} [emitAddListWhenCreatingQueue=true] Whether or not emitting `addList` event when creating a new Queue
 * @prop {boolean} [emitAddSongWhenCreatingQueue=true] Whether or not emitting `addSong` event when creating a new Queue
 * @prop {boolean} [joinNewVoiceChannel=true] Whether or not joining the new voice channel
 * when using {@link DisTube#play} method
 * @prop {StreamType} [streamType=StreamType.OPUS] Decide the {@link DisTubeStream#type} will be used
 * (Not the same as {@link DisTubeStream#type})
 */
export interface DisTubeOptions {
  plugins?: (CustomPlugin | ExtractorPlugin)[];
  emitNewSongOnly?: boolean;
  leaveOnFinish?: boolean;
  leaveOnStop?: boolean;
  leaveOnEmpty?: boolean;
  emptyCooldown?: number;
  savePreviousSongs?: boolean;
  searchSongs?: number;
  searchCooldown?: number;
  youtubeCookie?: string;
  youtubeIdentityToken?: string;
  customFilters?: Filters;
  ytdlOptions?: ytdl.downloadOptions;
  nsfw?: boolean;
  emitAddSongWhenCreatingQueue?: boolean;
  emitAddListWhenCreatingQueue?: boolean;
  joinNewVoiceChannel?: boolean;
  streamType?: StreamType;
}

/**
 * Data that can be resolved to give a guild id string. This can be:
 * - A guild id string | a guild {@link https://discord.js.org/#/docs/main/stable/class/Snowflake|Snowflake}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Guild|Guild}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Message|Message}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildVoiceChannel|BaseGuildVoiceChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/BaseGuildTextChannel|BaseGuildTextChannel}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/VoiceState|VoiceState}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/GuildMember|GuildMember}
 * - A {@link https://discord.js.org/#/docs/main/stable/class/Interaction|Interaction}
 * - A {@link DisTubeVoice}
 * - A {@link Queue}
 * @typedef {
 * Discord.Snowflake|
 * Discord.Guild|
 * Discord.Message|
 * Discord.BaseGuildVoiceChannel|
 * Discord.BaseGuildTextChannel|
 * Discord.VoiceState|
 * Discord.GuildMember|
 * Discord.Interaction|
 * DisTubeVoice|
 * Queue|
 * string
 * } GuildIdResolvable
 */
export type GuildIdResolvable =
  | Queue
  | DisTubeVoice
  | Snowflake
  | Message
  | GuildTextBasedChannel
  | VoiceBasedChannel
  | VoiceState
  | Guild
  | GuildMember
  | Interaction
  | string;

export interface OtherSongInfo {
  src?: string;
  id?: string;
  title?: string;
  name?: string;
  is_live?: boolean;
  isLive?: boolean;
  _duration_raw?: string | number;
  duration?: string | number;
  webpage_url?: string;
  url: string;
  thumbnail?: string;
  related?: RelatedSong[];
  view_count?: string | number;
  views?: string | number;
  like_count?: string | number;
  likes?: string | number;
  dislike_count?: string | number;
  dislikes?: string | number;
  repost_count?: string | number;
  reposts?: string | number;
  uploader?: string | { name: string; url: string };
  uploader_url?: string;
  age_limit?: string | number;
  chapters?: Chapter[];
  age_restricted?: boolean;
}

export interface Chapter {
  title: string;
  start_time: number;
}

export interface PlaylistInfo {
  source: string;
  member?: GuildMember;
  user?: User;
  songs: Song[];
  name?: string;
  url?: string;
  thumbnail?: string;
}

export type RelatedSong = Omit<Song, "related">;

/**
 * @typedef {Object} PlayHandlerOptions
 * @param {Discord.BaseGuildTextChannel} [options.textChannel] The default text channel of the queue
 * @param {boolean} [options.skip=false] Skip the playing song (if exists) and play the added playlist instantly
 * @param {number} [options.position=0] Position of the song/playlist to add to the queue,
 * <= 0 to add to the end of the queue.
 */
export type PlayHandlerOptions = {
  skip?: boolean;
  position?: number;
  textChannel?: GuildTextBasedChannel;
};

/**
 * @typedef {Object} PlayOptions
 * @param {Discord.GuildMember} [member] Requested user (default is your bot)
 * @param {Discord.BaseGuildTextChannel} [textChannel] Default {@link Queue#textChannel}
 * @param {boolean} [skip=false]
 * Skip the playing song (if exists) and play the added song/playlist if `position` is 1.
 * If `position` is defined and not equal to 1, it will skip to the next song instead of the added song
 * @param {number} [position=0] Position of the song/playlist to add to the queue,
 * <= 0 to add to the end of the queue.
 * @param {Discord.Message} [message] Called message (For built-in search events. If this is a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy|falsy value}, it will play the first result instead)
 * @param {*} [metadata] Optional metadata that can be attached to the song/playlist will be played,
 * This is useful for identification purposes when the song/playlist is passed around in events.
 * See {@link Song#metadata} or {@link Playlist#metadata}
 */
export interface PlayOptions extends PlayHandlerOptions, ResolveOptions<any> {
  message?: Message;
}

/**
 * @typedef {Object} ResolveOptions
 * @param {Discord.GuildMember} [member] Requested user
 * @param {*} [metadata] Metadata
 */
export interface ResolveOptions<T = unknown> {
  member?: GuildMember;
  metadata?: T;
}

/**
 * @typedef {ResolveOptions} ResolvePlaylistOptions
 * @param {string} [source] Source of the playlist
 */
export interface ResolvePlaylistOptions<T = unknown> extends ResolveOptions<T> {
  source?: string;
}

/**
 * @typedef {Object} CustomPlaylistOptions
 * @param {Discord.GuildMember} [member] A guild member creating the playlist
 * @param {Object} [properties] Additional properties such as `name`
 * @param {boolean} [parallel=true] Whether or not fetch the songs in parallel
 * @param {*} [metadata] Metadata
 */
export interface CustomPlaylistOptions {
  member?: GuildMember;
  properties?: Record<string, any>;
  parallel?: boolean;
  metadata?: any;
}

/**
 * The repeat mode of a {@link Queue} (enum)
 * * `DISABLED` = 0
 * * `SONG` = 1
 * * `QUEUE` = 2
 * @typedef {number} RepeatMode
 */
export enum RepeatMode {
  DISABLED,
  SONG,
  QUEUE,
}

/**
 * All available plugin types:
 * * `CUSTOM` = `"custom"`: {@link CustomPlugin}
 * * `EXTRACTOR` = `"extractor"`: {@link ExtractorPlugin}
 * @typedef {"custom"|"extractor"} PluginType
 */
export enum PluginType {
  CUSTOM = "custom",
  EXTRACTOR = "extractor",
}

/**
 * Search result types:
 * * `VIDEO` = `"video"`
 * * `PLAYLIST` = `"playlist"`
 * @typedef {"video"|"playlist"} PluginType
 */
export enum SearchResultType {
  VIDEO = "video",
  PLAYLIST = "playlist",
}

/**
 *
 * Stream types:
 * * `OPUS` = `0` (Better quality, use more resources - **Recommended**)
 * * `RAW` = `1` (Better performance, use less resources)
 * @typedef {number} StreamType
 * @type {StreamType}
 */
export enum StreamType {
  OPUS,
  RAW,
}

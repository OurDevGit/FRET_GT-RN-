export const MediaType = {
  song: "MediaType.song",
  lesson: "MediaType.lesson",
  jamAlong: "MediaType.jamAlong",
  video: "MediaType.video",
  unknown: "MediaType.unknown"
};

export default class {
  static schema = {
    name: "Media",
    primaryKey: "id",
    properties: {
      id: "string",
      name: "string",
      iTunesID: { type: "string", optional: true },
      sortName: { type: "string", optional: true },
      artist: { type: "string", optional: true },
      sortArtist: { type: "string", optional: true },
      album: { type: "string", optional: true },
      genre: { type: "string", optional: true },
      details: { type: "string", optional: true },
      isEasy: { type: "bool", default: false },
      hasBass: { type: "bool", default: false },
      isLive: { type: "bool", default: false },
      doesSupportDevice: { type: "bool", default: false },
      isSong: { type: "bool", default: false },
      isLesson: { type: "bool", default: false },
      isJamAlong: { type: "bool", default: false },
      isVideo: { type: "bool", default: false },
      duration: "double",
      previewStart: "double",
      previewDuration: "double",
      createdAt: "date",
      updatedAt: "date"
      // isCached: { type: "bool", default: false },
      // musicPath: {type:"string", optional:true},
      // midiPath: {type:"string", optional:true},
      // albumPath: {type:"string", optional:true},
      // artworkURL: {type:"string", optional:true},
      // trackURL: {type:"string", optional:true},
    }
  };

  get mediaType() {
    if (self.isSong) {
      return MediaType.song;
    } else if (self.isVideo) {
      return MediaType.video;
    } else if (self.isJamAlong) {
      return MediaType.jamAlong;
    } else if (self.isLesson) {
      return MediaType.lesson;
    } else {
      return MediaType.unknown;
    }
  }
}

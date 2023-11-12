use [master]
go


if db_id('UMusicDB') is not null
begin
	drop database [UMusicDB];
end
go


create database [UMusicDB];
go


use [UMusicDB];
go


create table [Collections](
	[Id] int not null identity(1,1),
	[Name] nvarchar(100) not null,
	[DateOfAddition] datetime not null default(GetDate()),
	[Songs] int not null default(0),
	[Duration] int not null default(0),
	[CoverImageLink] varchar(2048) null,

	constraint PK_Collections_Id primary key([Id]),
	constraint CK_Collections_Name check([Name] <> ''),
	constraint CK_Collections_Duration check([Duration] >= 0),
	constraint CK_Collections_Songs check([Songs] >= 0),
	constraint CK_Collections_CoverImageLink check([CoverImageLink] <> '')
);


create table [Users](
	[Id] int not null identity(1,1),
	[Username] varchar(30) unique not null,
	[Password] varchar(128) not null,
	[Email] varchar(256) not null,
	[Nickname] nvarchar(128) not null,
	[RegistrationDate] datetime not null default(GetDate()),
	[AvatarLink] varchar(2048) null,

	constraint PK_Users_Id primary key([Id]),
	constraint CK_Users_Username check([Username] <> ''),
	constraint CK_Users_Password check([Password] <> ''),
	constraint CK_Users_Email check([Email] <> ''),
	constraint CK_Users_Nickname check([Nickname] <> ''),
	constraint CK_Users_AvatarLink check([AvatarLink] <> ''),
);


create table [Listeners](
	[Id] int not null identity(1,1),
	[UserId] int not null,
	[LikedSongsCollectionId] int not null,
	[LastLoginDate] datetime not null,
	[PublicPlaylists] int not null default(0),
	[Following] int not null default(0),
	
	constraint PK_Listeners_Id primary key([Id]),
	constraint FK_Listeners_UserId foreign key([UserId]) references [Users]([Id])
	on delete cascade
	on update cascade,
	constraint FK_Listeners_LikedSongsCollectionId foreign key([LikedSongsCollectionId]) references [Collections]([Id])
	on delete cascade
	on update cascade,
	constraint CK_Listeners_PublicPlaylists check([PublicPlaylists] >= 0),
	constraint CK_Listeners_Following check([Following] >= 0)
);


create table [Artists](
	[Id] int not null identity(1,1),
	[UserId] int not null,
	[Followers] int not null default(0),
	[MonthlyListeners] int not null default(0),
	[Songs] int not null default(0),
	[Albums] int not null default(0),
	[Singles] int not null default(0),
	[EPs] int not null default(0),

	constraint PK_Artists_Id primary key ([Id]),
	constraint FK_Artists_UserId foreign key([UserId]) references [Users]([Id])
	on delete cascade
	on update cascade,
	constraint CK_Artists_Followers check([Followers] >= 0),
	constraint CK_Artists_MonthlyListeners check([MonthlyListeners] >= 0),
	constraint CK_Artists_Songs check([Songs] >= 0),
	constraint CK_Artists_Albums check([Albums] >= 0),
	constraint CK_Artists_Singles check([Singles] >= 0),
	constraint CK_Artists_EPs check([EPs] >= 0)
);


create table [Genres](
	[Id] int not null identity(1,1),
	[Name] nvarchar(50) not null,

	constraint PK_Genres_Id primary key([Id]),
	constraint CK_Genres_Name check([Name] <> ''),
);


create table [Releases](
	[Id] int not null identity(1,1),
	[CollectionId] int not null,
	[ReleaseDate] date not null,
	[Type] varchar(6),
	
	constraint PK_Releases_Id primary key ([Id]),
	constraint FK_Releases_CollectionId foreign key([CollectionId]) references [Collections]([Id])
	on delete cascade
	on update cascade,
	constraint CK_Releases_Type check(([Type] <> '') and ([Type] = 'Album' or [Type] = 'Single' or [Type] = 'EP'))
);


create table [ReleasesArtists](
	[ReleaseId] int not null,
	[ArtistId] int not null,

	constraint PK_ReleasesArtists primary key([ReleaseId], [ArtistId]),
	constraint FK_ReleasesArtists_ReleaseId foreign key([ReleaseId]) references [Releases]([Id])
	on delete cascade
	on update cascade,
	constraint FK_ReleasesArtists_ArtistId foreign key([ArtistId]) references [Artists]([Id])
	on delete cascade
	on update cascade
);


create table [Audios](
	[Id] int not null identity(1,1),
	[Name] nvarchar(150) not null,
	[Duration] smallint not null,
	[GenreId] int not null,
	[ReleaseId] int not null,
	[Lyric] nvarchar(2000) null,
	[AudioLink] varchar(2048) not null,

	constraint PK_Audios_Id primary key([Id]),
	constraint CK_Audios_Name check([Name] <> ''),
	constraint CK_Audios_Duration check([Duration] >= 0),
	constraint FK_Audios_GenreId foreign key([GenreId]) references [Genres]([Id])
	on delete cascade
	on update cascade,
	constraint FK_Audios_ReleaseId foreign key([ReleaseId]) references [Releases]([Id])
	on delete cascade
	on update cascade,
	constraint CK_Audios_Lyric check([Lyric] <> ''),
	constraint CK_Audios_AudioLink check([AudioLink] <> '')
);


create table [AudiosArtists](
	[AudioId] int not null,
	[ArtistId] int not null,

	constraint PK_AudiosArtists primary key([AudioId], [ArtistId]),
	constraint FK_AudiosArtists_AudioId foreign key([AudioId]) references [Audios]([Id])
	on delete cascade
	on update cascade,
	constraint FK_AudiosArtists_ArtistId foreign key([ArtistId]) references [Artists]([Id])
	on delete cascade
	on update cascade
);


create table [Playlists](
	[Id] int not null identity(1,1),
	[CollectionId] int not null,
	[Description] nvarchar(300) not null,

	constraint PK_Playlists_Id primary key ([Id]),
	constraint FK_Playlists_CollectionId foreign key([CollectionId]) references [Collections]([Id])
	on delete cascade
	on update cascade,
	constraint CK_Playlists_Description check([Description] <> '')
);


create table [PlaylistsCreators](
	[PlaylistId] int not null,
	[ListenerId] int not null,

	constraint PK_PlaylistsCreators primary key([PlaylistId], [ListenerId]),
	constraint FK_PlaylistsCreators_PlaylistId foreign key([PlaylistId]) references [Playlists]([Id])
	on delete no action
	on update no action,
	constraint FK_PlaylistsCreators_ListenerId foreign key([ListenerId]) references [Listeners]([Id])
	on delete cascade
	on update cascade
);


create table [PlaylistsListeners](
	[PlaylistId] int not null,
	[ListenerId] int not null,

	constraint PK_PlaylistsListeners primary key([PlaylistId], [ListenerId]),
	constraint FK_PlaylistsListeners_PlaylistId foreign key([PlaylistId]) references [Playlists]([Id])
	on delete no action
	on update no action,
	constraint FK_PlaylistsListeners_ListenerId foreign key([ListenerId]) references [Listeners]([Id])
	on delete cascade
	on update cascade
);


create table [PlaylistsAudios](
	[PlaylistId] int not null,
	[AudioId] int not null,

	constraint PK_PlaylistsAudios primary key([PlaylistId], [AudioId]),
	constraint FK_PlaylistsAudios_PlaylistId foreign key([PlaylistId]) references [Playlists]([Id])
	on delete cascade
	on update cascade,
	constraint FK_PlaylistsAudios_AudioId foreign key([AudioId]) references [Audios]([Id])
	on delete no action
	on update no action
);


create table [ListenerHistory](
	[Id] int not null identity(1,1),
	[ListenerId] int not null,
	[AudioId] int not null,
	[ListenedAt] datetime not null,

	constraint PK_ListenerHistory_Id primary key([Id]),
	constraint FK_ListenerHistory_ListenerId foreign key([ListenerId]) references [Listeners]([Id]) 	
	on delete cascade
	on update cascade,
	constraint FK_ListenerHistory_AudioId foreign key([AudioId]) references [Audios]([Id])
	on delete no action
	on update no action
);
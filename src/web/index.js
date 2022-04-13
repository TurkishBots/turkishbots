const express = require("express");
const app = express();

module.exports = client => {
	app.get("/", (_req, res) => res.status(406).send({ success: false, error: { message: "Please provide a user id.", example: "/user/530043492014096384", code: 406 } }));

	app.get("/user/:id?", (req, res) => {
		if (!req.params?.id) return res.status(406).send({ success: false, error: { message: "Please provide a user id.", example: "/user/530043492014096384", code: 406 } });
		if (req.params?.id?.trim?.() && !req.params?.id?.match?.(/^[0-9]{18}$/g)) return res.status(406).send({ success: false, error: { message: "Id is not snowflake.", code: "id_not_slowflake" } });
		const member = client.guilds.cache.get(client.config.guild).members.cache.get(req.params.id);
		const user = member?.user;
		if (!user) return res.status(404).send({ success: false, error: { message: "User is not being monitored by TurkishMethods.", code: "user_not_monitored" } });
		const spotify = member?.presence?.activities?.find?.(a => a.type === "LISTENING" && a.name === "Spotify" && a.id === "spotify:1");
		res.status(200).send({
			success: true,
			data: {
				spotify: spotify
					? {
							track_id: spotify.sync_id,
							timestamps: {
								start: spotify.timestamps.start,
								end: spotify.timestamps.end,
							},
							song: spotify.details,
							artist: spotify.state,
							album_art_url: `https://i.scdn.co/image/${spotify.assets.largeImage.split(":").pop()}`,
							album: spotify.assets.largeText,
					  }
					: null,
				discord_user: {
					username: user.username,
					public_flags: user.flags.bitfield,
					id: user.id,
					discriminator: user.discriminator,
					avatar: user.avatar,
				},
				activities:
					member?.presence?.activities?.map?.(activity => ({
						type: activity.type,
						timestamps: {
							start: new Date(activity.timestamps?.start).getTime(),
						},
						sync_id: activity.syncId,
						state: activity.state,
						session_id: activity.sessionId,
						name: activity.name,
						id: activity.id,
						details: activity.details,
						created_at: new Date(activity.created_at).getTime(),
						assets: {
							small_text: activity?.assets?.smallText ?? null,
							small_image: activity?.assets?.smallImage ?? null,
							large_text: activity?.assets?.largeText ?? null,
							large_image: activity?.assets?.largeImage ?? null,
						},
						application_id: activity.applicationId,
					})) ?? [],
				discord_status: member?.presence?.status ?? "offline",
				active_on_discord_web: member?.presence?.clientStatus?.web ?? false,
				active_on_discord_mobile: member?.presence?.clientStatus?.mobile ?? false,
				active_on_discord_desktop: member?.presence?.clientStatus?.desktop ?? false,
			},
		});
	});

	app.use((_req, res) => res.status(404).send({ error: "Not found", code: 404 }));

	app.listen(process.env.PORT || 3000);
};

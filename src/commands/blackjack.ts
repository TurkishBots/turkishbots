import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, MessageEmbed, MessageReaction, User, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const hitEmoji = "👊";
const stopEmoji = "🛑";

interface Card {
	name: string;
	value: number;
}

const blackjack: DiscordCommand = {
	conf: {
		aliases: ["bj", "21"],
		permLevel: Permissions.DEFAULT,
		category: "Eğlence"
	},

	help: {
		name: "blackjack",
		description: "Blackjack oynarsınız.",
		usage: "blackjack"
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		const dealerCards: Card[] = [];
		const playerCards: Card[] = [];
		const embed = new MessageEmbed();
		await startGame(message, embed, dealerCards, playerCards);
	}
};

async function startGame(message: Message, embed: MessageEmbed, dealerCards: Card[], playerCards: Card[]) {
	//! Set Vars
	dealerCards.push(getRandomCard());
	dealerCards.push(getRandomCard());
	playerCards.push(getRandomCard());
	playerCards.push(getRandomCard());
	//? End of vars
	//! Set embed
	embed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
	embed.setColor("#0099ff");
	embed.setFooter({ text: "🎲 ~ Blackjack" });
	embed.addField(`Tüccar \`[${dealerCards[0].value}+?]\``, `${dealerCards[0].name}+?`, true);
	embed.addField(`${message.author.username} \`[${getTotal(playerCards)}]\``, `${playerCards.map((card: Card) => card.name).join("+")}`, true);
	//? End of embed
	const Embed = await message.reply({ embeds: [embed] });
	await Embed.react(hitEmoji);
	await Embed.react(stopEmoji);
	const filter = (r: MessageReaction, user: User) => [hitEmoji, stopEmoji].includes(r.emoji.name) && user.id === message.author.id;
	const collector = Embed.createReactionCollector({ filter, time: 60000 });
	collector.on("collect", async (r: MessageReaction) => {
		if (r.emoji.name === hitEmoji) await hit(Embed, embed, dealerCards, playerCards, message);
		else if (r.emoji.name === stopEmoji) await stop(Embed, embed, dealerCards, playerCards);
	});
	collector.on("end", (_collected, reason) => {
		if (reason === "time") Embed.reactions.removeAll();
	});
}

function getRandomCard(): Card {
	const cards = [
		{
			name: "A",
			value: 11
		},
		{
			name: "2",
			value: 2
		},
		{
			name: "3",
			value: 3
		},
		{
			name: "4",
			value: 4
		},
		{
			name: "5",
			value: 5
		},
		{
			name: "6",
			value: 6
		},
		{
			name: "7",
			value: 7
		},
		{
			name: "8",
			value: 8
		},
		{
			name: "9",
			value: 9
		},
		{
			name: "10",
			value: 10
		},
		{
			name: "J",
			value: 10
		},
		{
			name: "Q",
			value: 10
		},
		{
			name: "K",
			value: 10
		}
	];
	const randomCard = cards[Math.floor(Math.random() * cards.length)];
	return randomCard;
}

function getTotal(cards: Card[]) {
	return cards.reduce((total, card) => total + card.value, 0);
}

async function hit(message: Message, embed: MessageEmbed, dealerCards: Card[], playerCards: Card[], userMessage: Message) {
	const newPlayerCard = getRandomCard();
	const newDealerCard = getRandomCard();
	playerCards.push(newPlayerCard);
	dealerCards.push(newDealerCard);
	embed.fields[1].value += `+${newPlayerCard.name}`;
	embed.fields[1].name = `${message.author.username} \`[${getTotal(playerCards)}]\``;
	await message.reactions.cache
		.get(hitEmoji)
		.users.remove(userMessage.author)
		.catch(() => {});
	if (getTotal(playerCards) > 21 && getTotal(dealerCards) > 21) {
		message.reactions.removeAll();
		embed.setColor("ORANGE");
		embed.setFooter({ text: "🤔 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(playerCards) > 21 || getTotal(dealerCards) === 21) {
		message.reactions.removeAll();
		embed.setColor("RED");
		embed.setFooter({ text: "💀 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(playerCards) === 21 || getTotal(dealerCards) > 21) {
		message.reactions.removeAll();
		embed.setColor("GREEN");
		embed.setFooter({ text: "🎉 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	}
	await message.edit({ embeds: [embed] });
}

async function stop(message: Message, embed: MessageEmbed, dealerCards: Card[], playerCards: Card[]) {
	if (getTotal(dealerCards) < 17) dealerCards.push(getRandomCard());
	if (getTotal(dealerCards) > 21) {
		message.reactions.removeAll();
		embed.setColor("GREEN");
		embed.setFooter({ text: "🎉 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(dealerCards) === 21 && getTotal(playerCards) < 21) {
		message.reactions.removeAll();
		embed.setColor("RED");
		embed.setFooter({ text: "💀 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(dealerCards) > getTotal(playerCards)) {
		message.reactions.removeAll();
		embed.setColor("RED");
		embed.setFooter({ text: "💀 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(dealerCards) < getTotal(playerCards)) {
		message.reactions.removeAll();
		embed.setColor("GREEN");
		embed.setFooter({ text: "🎉 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	} else if (getTotal(dealerCards) === getTotal(playerCards)) {
		message.reactions.removeAll();
		embed.setColor("ORANGE");
		embed.setFooter({ text: "🤔 ~ Blackjack" });
		showDealerCards(dealerCards, embed);
	}
	await message.edit({ embeds: [embed] });
}

function showDealerCards(dealerCards: Card[], embed: MessageEmbed): void {
	embed.fields[0].name = `Tüccar \`[${getTotal(dealerCards)}]\``;
	embed.fields[0].value = dealerCards.map((card: Card) => card.name).join("+");
}

export default blackjack;

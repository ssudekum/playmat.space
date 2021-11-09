// TODO: implement CardFace interface
// TODO: implement Colors interface

import ImageURI from "./ImageURI";
import Identifiable from "./Identifiable";

/**
 * An interface representing Magic the Gathering cards results from the Scryfall API.
 */
export default interface Card extends Identifiable {

  // Core Card Fields

  arena_id?: number // This card’s Arena ID, if any. A large percentage of cards are not available on Arena and do not have this ID.
  id: string // A unique UUID for this card in Scryfall’s database.
  lang: string // A language code for this printing.
  mtgo_id?: number // This card’s Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
  mtgo_foil_id?: number // This card’s foil Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
  multiverse_ids?: Array<string> // This card’s multiverse IDs on Gatherer, if any, as an array of numbers. Note that Scryfall includes many promo cards, tokens, and other esoteric objects that do not have these identifiers.
  tcgplayer_id?: number // This card’s ID on TCGplayer’s API, also known as the productId.
  object: string // A content type for this object, always card.
  oracle_id: string // A unique UUID for this card’s oracle identity. This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
  prints_search_uri: string // A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
  rulings_uri: string// A link to this card’s rulings list on Scryfall’s API.
  scryfall_uri: string // A link to this card’s permapage on Scryfall’s website.
  uri: string // A link to this card object on Scryfall’s API.

  // Gameplay Fields
  // Cards have the following properties relevant to the game rules:

  all_parts?: Array<Card> // If this card is closely related to other cards, this property will be an array with Related Card Objects.
  card_faces?: Array<Object> // An array of Card Face objects, if this card is multifaced.
  cmc: number // The card’s converted mana cost. Note that some funny cards have fractional mana costs.
  colors: string // This card’s colors, if the overall card has colors defined by the rules. Otherwise the colors will be on the card_faces objects, see below.
  keywords: Array<string> // An array of keywords that this card uses, such as 'Flying' and 'Cumulative upkeep'.
  color_identity: string // This card’s color identity.
  color_indicator?: string // The colors in this card’s color indicator, if any. A null value for this field indicates the card does not have one.
  edhrec_rank?: number // This card’s overall rank/popularity on EDHREC. Not all cards are ranked.
  foil: boolean // True if this printing exists in a foil version.
  hand_modifier?: string // This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
  layout: string // A code for this card’s layout.
  legalities: Object // An object describing the legality of this card across play formats. Possible legalities are legal, not_legal, restricted, and banned.
  life_modifier?: string //This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
  loyalty?: string //This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
  mana_cost?: string //The mana cost for this card. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values. Multi-faced cards will report this value in card faces.
  name: string // The name of this card. If this card has multiple faces, this field will contain both names separated by ␣//␣.
  nonfoil: boolean // True if this printing exists in a nonfoil version.
  oracle_text?: string //The Oracle text for this card, if any.
  oversized: boolean // True if this card is oversized.
  power?: string //This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
  reserved: boolean // True if this card is on the Reserved List.
  toughness?: string // This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
  type_line: string // The type line of this card.

  // Print Fields
  // Cards have the following properties unique to their particular re/print:

  artist?: string	// The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
  booster: boolean // Whether this card is found in boosters.
  border_color: string // This card’s border color: black, borderless, gold, silver, or white.
  card_back_id: string // The Scryfall UUID for the card back design present on this card.
  collector_number: string // This card’s collector number. Note that collector numbers can contain non-numeric characters, such as letters or ★.
  digital: boolean // True if this card was only released in a video game.
  flavor_name?: string // The just-for-fun name printed on the card (such as for Godzilla series cards).
  flavor_text?: string // The flavor text, if any.
  frame_effects?: Array<string> // This card’s frame effects, if any.
  frame: string // This card’s frame layout.
  full_art: boolean // True if this card’s artwork is larger than normal.
  games: Array<string> // A list of games that this card print is available in, paper, arena, and/or mtgo.
  highres_image: boolean // True if this card’s imagery is high resolution.
  illustration_id?: string // A unique UUID for the card artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
  image_uris?: ImageURI // An object listing available imagery for this card. See the Card Imagery article for more information.
  prices: Object // An object containing daily price information for this card, including usd, usd_foil, eur, and tix prices, as strings.
  printed_name?: string // The localized name printed on this card, if any.
  printed_text?: string // The localized text printed on this card, if any.
  printed_type_line?: string // The localized type line printed on this card, if any.
  promo: boolean // True if this card is a promotional print.
  promo_types?: Array<string>	// An array of strings describing what categories of promo cards this card falls into.
  purchase_uris: Object // An object providing URIs to this card’s listing on major marketplaces.
  rarity: string // This card’s rarity. One of common, uncommon, rare, or mythic.
  related_uris: Object // An object providing URIs to this card’s listing on other Magic: The Gathering online resources.
  released_at: Date // The date this card was first released.
  reprint: boolean // True if this card is a reprint.
  scryfall_set_uri: string // A link to this card’s set on Scryfall’s website.
  set_name: string // This card’s full set name.
  set_search_uri: string // A link to where you can begin paginating this card’s set on the Scryfall API.
  set_type: string // The type of set this printing is in.
  set_uri: string // A link to this card’s set object on Scryfall’s API.
  set: string // This card’s set code.
  story_spotlight: boolean // True if this card is a Story Spotlight.
  textless: boolean // True if the card is printed without text.
  variation: boolean // Whether this card is a variation of another printing.
  variation_of?: string // The printing UUID of the printing this card is a variation of.
  watermark?: string // This card’s watermark, if any.
  preview?: Object
}
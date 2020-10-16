/**
 *  - Rem Service
 */
const { searchAnimeRem, sendHookRem } = require("./anime");

/**
 *  - Prunia Service
 */

const { sendHookPrunia } = require("./curso");

/**
 * Global Service
 */
const shortLink = require("./shortLink");

module.exports = {
  searchAnimeRem,
  sendHookRem,
  sendHookPrunia,
  shortLink,
};

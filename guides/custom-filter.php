<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="author" content="PhoenixTheHunter">
	<meta name="description" content="Cheat Sheet for Custom Filters">
	<meta name="keywords" content="Blue Manchu, Card Hunter, util, utils, utility, utilities, PhoenixTheHunter, Custom Filter, Cheat Sheet">
	<title>Custom Filter - Cheat Sheet, Card Hunter Utilities, by PhoenixTheHunter</title>
	<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
	<link rel="stylesheet" type="text/css" href="../layout/corporate-design.css">
	<link rel="stylesheet" type="text/css" href="../layout/signature.css">
	<link rel="stylesheet" type="text/css" href="../layout/primitives.css">
	<link rel="stylesheet" type="text/css" href="../layout/layout-wide.css">
	<script data-main="../script/guides/custom-filter.js" src="../external/require.js"></script>
</head>
<body>
<?php echo file_get_contents('../layout/signature.xml');?>
<!--
Guidelines for contributors:
1. Make sure you have the most recent version of this document before editing something.
2. Don't change anything above this guidelines (this guidelines included) or the disclaimer. The only permitted change to the contributor's segment is adding yourself to the list.
3. Write proper English.
4. For reasonable edits (which is more or less everything except minor typo correction) consider adding yourself to the contributor's segment.
Style-Guide for contributors:
* Every header element (h1, h2, ...) has to be followed by some text.
* Insert html-line-breaks (<br/>) only (but in these cases always) before and after (unless there is a header afterwards): code-blocks, "Example(s):" and Warnings (like the ATTENTION-blocks).
* Insert text-line-breaks to ease the reading of this document. Suggestion: one sentence per line.
* Escape EVERY less than, greater than and AND sign ("<", ">", "&") in text and code with &lt;, &gt; or &amp; respectively.
* Use the textual "and", "or", "xor" and "not" notation for filter composition.
* Include a short textual explanation in your code-blocks (in parentheses). For longer explanations use regular text.
* Use text-formatting very rarely.
* Feel free to use a narrative style but keep the text free from any offensive words.
* Wrap each rule and filter in a anchor tag (<a ...>...</a>) to enable this page to turn them into "executable" queries.
  * Each of those anchor tags needs the class 'query' in order for the page to differentiate them from other links.
  * If the filter or rule is written for items (or if applicable for both items and cards and fits more for items) also add the class 'item'.
  * Card based filer don't need another class because card based execution is the default mode for the Card and Item Query tool.
  * Be careful to not wrap the explanation, too, because the explanation in most cases isn't a proper query itself and would cause the filter execution to fail.
-->
<a id='top' class='anchor'></a><h1>Cheat Sheet for Custom Filter</h1>
This document should guide you through the process of defining your own custom filter for tools like the collection analysis tool or the card and item query tool.
The custom filter is similar to what the Keep's filter does but allows a more fine-grained filtering.
Unfortunately, this comes with a more complex syntax and requires a basic knowledge of the equipment and card description files provided by the game server.
<h2>Table of Contents</h2>
<ul>
<li><a href='#DescFiles'>The Equipment and Card Description Files</a></li>
<li><a href='#Syntax'>The Syntax</a></li>
<li><a href='#Scenarios'>Concrete Scenarios</a></li>
<li><a href='#Grammar'>The Grammar</a></li>
<li><a href='#Disclaimer'>Disclaimer</a></li>
<li><a href='#Contribs'>Contributors</a></li>
</ul>
<a id='DescFiles' class='anchor'></a><h2>The Equipment and Card Description Files [<a href='#top'>top</a>]</h2>
The game server provides - among other files, of course - two files describing the available items and the existing cards.
These files contain data in a table-like format with column-headers.
Both files are included in the tool's source code for further clarification or inspiration.
To define a custom filter you need these column-headers, therefore, the first step is to get to know them.
<div style="color:red">ATTENTION: The capitalization is important for the filter. If you misspell the headers the filter won't find the expected values.</div>
<h3>Equipment Description File</h3>
Here are the column-headers of the equipment description file.
The corresponding values are strictly non-empty unless stated otherwise.
Emphasized (italic) headers are very likely to be irrelevant for most users.
<table border="1">
	<tr><th>Header</th><th>Format</th><th>possibly empty?</th><th>Description</th></tr>
	<tr><td>Id</td><td>Number</td><td></td><td>a unique number identifying the item</td></tr>
	<tr><td>Equipment Name</td><td>Text</td><td></td><td>the item's name as used in-game</td></tr>
	<tr><td>Short Name</td><td>Text</td><td>&#10004;</td><td>a shorter name for certain cases where only limited space is available - only set if the original name is too long</td></tr>
	<tr><td>Rarity</td><td>Text</td><td></td><td>"Common", "Uncommon", "Rare", "Epic" or "Legendary"</td></tr>
	<tr><td>Level</td><td>Number</td><td></td><td>the item's level</td></tr>
	<tr><td>Introductory Level</td><td>Number</td><td>&#10004;</td><td>the renown you have to have to find the item in campaign loot - empty for treasures</td></tr>
	<tr><td>Talent 1</td><td>Number</td><td>&#10004;</td><td>the first power token: "0" represents no token requirement, "1" for a minor token, "2" for a major token - empty for treasures</td></tr>
	<tr><td>Talent 2</td><td>Number</td><td>&#10004;</td><td>the second power token, "-1" if not weapon, divine weapon or staff, otherwise see encoding above - empty for treasures</td></tr>
	<tr><td>Card 1 (<i>up to</i> Card 10)</td><td>Text</td><td>&#10004;</td><td>the name of the corresponding card - empty if item has less cards or is treasure</td></tr>
	<tr><td>Slot</td><td>Text</td><td></td><td style="white-space:pre">"Arcane Item", "Arcane Skill", "Boots", "Divine Armor", "Divine Item", "Divine Skill", "Divine Weapon", "Dwarf Skill", "Elf Skill",
"Heavy Armor", "Helmet", "Human Skill", "Martial Skill", "Robes", "Shield", "Staff", "Treasure", "Weapon"</td></tr>
	<tr><td>Set</td><td>Number</td><td></td><td>"0" for base items, "1" for AotA, "2" for EttSC, "3" for AA, "4" for AI, "5" for CM</td></tr>
	<tr><td><em>Total Value</em></td><td>Number</td><td></td><td>the calculated item level based on the contained cards, usually "5" for treasures</td></tr>
	<tr><td><em>Slot Default</em></td><td>Text</td><td>&#10004;</td><td>contains the slot name to identify this item as default for its slot (usually filtered out before the custom filter gets applied) - empty for any actual collectible item</td></tr>
	<tr><td><em>Image</em></td><td>Text</td><td></td><td>the name of the image file that displays this item</td></tr>
	<tr><td><em>Tags</em></td><td>Text</td><td>&#10004;</td><td>special hints for the game (like "noLoot" for items that cannot drop) - empty for any regular item</td></tr>
	<tr><td><em>Manual Rarity</em></td><td>Text</td><td>&#10004;</td><td>a manual set rarity for items that wouldn't meet the developer's demands otherwise</td></tr>
	<tr><td><em>Manual Value</em></td><td>Number</td><td>&#10004;</td><td>a manual set value (and therefore level) for items that wouldn't meet the developer's demands otherwise</td></tr>
</table>
<h3>Card Description File</h3>
Here are the column-headers of the card description file.
Columns that contain a "(2)" are available either with or without an additional "2", hence, there is a header "Trigger" and a header "Trigger 2".
The corresponding values can be empty unless stated otherwise.
A check mark in parentheses signalize columns that are non-empty in most cases but technically can be empty.
Emphasized (italic) headers are very likely to be irrelevant for most users.
<table border="1">
	<tr><th>Header</th><th>Format</th><th>strictly non-empty?</th><th>Description</th></tr>
	<tr><td>ID</td><td>Number</td><td>&#10004;</td><td>a unique number identifying the card</td></tr>
	<tr><td>Card Name</td><td>Text</td><td>&#10004;</td><td>the card's name as used in-game</td></tr>
	<tr><td>Short Name</td><td>Text</td><td></td><td>a shorter name for certain cases where only limited space is available - only set if the original name is too long</td></tr>
	<tr><td>Types</td><td>Text</td><td>&#10004;</td><td>"Armor", "Assist", "Attack", "Block", "Boost", "Handicap", "Move", "Utility", or two of the types separated by comma</td></tr>
	<tr><td>Attack Type</td><td>Text</td><td></td><td>"Melee", "Projectile", "Magic"</td></tr>
	<tr><td>Damage Type</td><td>Text</td><td></td><td style="white-space:pre">"Acid", "Arcane", "Cold", "Crushing", "Electrical", "Fire", "Holy", "Laser",
"Piercing", "Poison", "Psychic", "Radiation", "Silver", "Slashing", "Sonic", "Unholy"</td></tr>
	<tr><td>Damage</td><td>Number</td><td></td><td>the number of damage points this card causes</td></tr>
	<tr><td>Minimum Range</td><td>Number</td><td></td><td>a minimum number of cells between your character and the target</td></tr>
	<tr><td>Range</td><td>Number</td><td></td><td>the maximum number of cells between your character and the target</td></tr>
	<tr><td>Move Points</td><td>Number</td><td></td><td>possible move range for moves and step attacks</td></tr>
	<tr><td>Duration</td><td>Number</td><td></td><td>the time a card stays attached</td></tr>
	<tr><td>Trigger (2)</td><td>Number</td><td></td><td>the number your die roll has to match or exceed</td></tr>
	<tr><td>Keep (2)</td><td>Number</td><td></td><td>flag indicating if this card is discarded after activation</td></tr>
	<tr><td>Trigger Effect (2)</td><td>Text</td><td></td><td>what type of effect does the roll have: "Armor", "Block", "Boost", "Handicap", "Move", "Special"</td></tr>
	<tr><td>Text</td><td>Text</td><td></td><td>primary (active) card effect text</td></tr>
	<tr><td>Trigger Text (2)</td><td>Text</td><td></td><td>secondary (passive) card effect text</td></tr>
	<tr><td>Plus Minus</td><td>Text</td><td></td><td>"+" or "-" if card is rated above or below other cards with the same quality</td></tr>
	<tr><td>Quality</td><td>Text</td><td>&#10004;</td><td style="white-space:pre">the card's quality (title color), "E" for Black, "D" for Paper, "C" for Bronze,
"B" for Silver, "A" for Gold, "AA" for Emerald, "AAA" for Amethyst</td></tr>
	<tr><td>Quality <i>x</i> (where <i>x</i> is either a class or a race)</td><td>Text</td><td></td><td>the card's quality if part of items of this class or race</td></tr>
	<tr><td>Rarity</td><td>Text</td><td>(&#10004;)</td><td>"Common", "Uncommon" or "Rare"</td></tr>
	<tr><td>Set</td><td>Number</td><td>&#10004;</td><td>"0" for base items, "1" for AotA, "2" for EttSC, "3" for AA, "4" for AI, "5" for CM</td></tr>
	<tr><td>Level</td><td>Number</td><td></td><td>the card's complexity, the item's introductory level is the highest level of the contained cards</td></tr>
	<tr><td>Slots</td><td>Text</td><td></td><td>the slots this card may appear in, separated by comma (may greatly differ from the actual items containing this card)</td></tr>
	<tr><td><em>Flavor Text</em></td><td>Text</td><td></td><td>mostly funny notes (anecdotes, (fictional) citations) without effect on the game</td></tr>
	<tr><td><em>Play Text</em></td><td>Text</td><td></td><td>text to show when card is (actively) played</td></tr>
	<tr><td><em>Trigger Attempt Text (2)</em></td><td>Text</td><td></td><td>text to show before die roll</td></tr>
	<tr><td><em>Trigger Succeed Text (2)</em></td><td>Text</td><td></td><td>text to show if roll succeeded</td></tr>
	<tr><td><em>Trigger Fail Text (2)</em></td><td>Text</td><td></td><td>text to show if roll failed</td></tr>
	<tr><td><em>Component1 (<i>up to</i> Component5)</em></td><td>Text</td><td></td><td>technical game component this card is built upon</td></tr>
	<tr><td><em>Params1 (<i>up to</i> Params5)</em></td><td>Text</td><td></td><td>the parameter for the matching component</td></tr>
	<tr><td><em>Params</em></td><td>Text</td><td></td><td>AI parameter</td></tr>
	<tr><td><em>Function Tags</em></td><td>Text</td><td></td><td>AI hints</td></tr>
	<tr><td><em>Attachment Image</em></td><td>Text</td><td></td><td>image to attach to terrain upon card effect</td></tr>
	<tr><td><em>Status</em></td><td>Text</td><td></td><td>flag to indicate the card's implementation status</td></tr>
	<tr><td><em>Audio Key (2)</em></td><td>Text</td><td></td><td>sound file to play upon card effect</td></tr>
	<tr><td><em>Art</em></td><td>Text</td><td></td><td>flag to indicate the card's graphical status</td></tr>
</table>
<a id='Syntax' class='anchor'></a><h2>The Syntax [<a href='#top'>top</a>]</h2>
Given you know the headers that are relevant for you and the values you want to test against, the next step is to formulate your desired filter in terms of rules.
There are two steps when creating a filter, creating the rules that actually check the property of some card or item and combining the simple check rules to much more powerful and complex filters.
For advanced purposes there are also rules that combine those two aspects insofar as they check some property but also serve as a method of compostion.
But the first two steps should be sufficient to construct most filters, so starters should focus on those easier methods of filter creation.
All example rules and filters are clickable and will be opened as query in the card and item query tool with the correct search base already selected.
<h3>Checking Rules</h3>
Let's start the actual filter creation with writing checking rules.
Checking rules are a direct translation of the relevant headers into the basic elements of each filter.
There are two types of simple rules, one for text columns and one for number columns.
<h4>Text Rules</h4>
To test the value of a text column use the following pattern:<br>
<code>[column-header] comparator "value"<br/>
comparator: == (equals) or != (does not equal) or =~ (contains) or !~ (does not contain)<br/>
with square brackets "[", "]"</code><br/>
Examples:<br/>
<code><a class='query item'>[Slot] == "Boots"</a> (only show items that are boots)<br/>
<a class='query item'>[Rarity] != "Common"</a> (exclude common items/cards)<br/>
<a class='query'>[Types] =~ "Move"</a> (find cards that include some notion of movement)<br/>
<a class='query'>[Quality] !~ "A"</a> (find cards with quality at most silver)</code><br/>
Note that all headers can be queried with a text rule although you lose some of the filter power if you use text rules on number headers.<br/>
There is a special text rule style that tries to match against all columns (including number columns):<br/>
<code>[] comparator "value"</code><br/>
Usually, this rule should be used with one of the "contains"-comparators.<br/>
Example:<br/>
<code><a class='query'>[] =~ "Penetrating"</a> (roughly find penetrating attack cards, checks whether any column of an item contains the given term)<br/>
<a class='query'>[] !~ "Electrical"</a> (exclude all cards that use the term Electrical somewhere, no column may contain the given term)</code>
<h4>Number Rules</h4>
To test the value of a number column use the following pattern:<br>
<code>{column-header} comparator value<br/>
comparator: == or != or &lt; or &lt;= or &gt; or &gt;=<br/>
with curly brackets "{", "}"</code><br/>
Examples:<br/>
<code><a class='query'>{Range} &gt;= 3</a> (find long range cards)<br/>
<a class='query item'>{Talent 1} == 0</a> (find token-less items)<br/>
<a class='query item'>{Level} &lt; 12</a> (find items of some level or below)</code><br/>
Applying number rules on textual header will always succeed but either exclude all or include all cards or items.
Applying the number rule on columns that may be empty can yield false results because an empty entry isn't interpreted as a number.
Consider making a textual empty-check first:<br/>
<code><a class='query item'>[Talent 1] != "" and {Talent 1} &lt;= 1</a> (find all not-treasure items with at most minor token requirement, for other methods of rule composition see next segment)</code>
<h3>Methods of Rule Composition</h3>
If you have your simple rules assembled, the next and final step is to compose your overall filter out of the simpler checking rules.
For this composition step you can choose from the following composition methods:
<h4>Negation</h4>
Write an exclamation mark ("!") or the word "not" in front of a rule to negate it.<br/>
Example:<br/>
<code><a class='query'>not [Types] == "Handicap"</a> (exclude all pure handicap cards)</code><br/>
Note that most negated rules can be rewritten without explicit negation so it's just a matter of taste. The above filter is equivalent to:<br/>
<code><a class='query'>[Types] != "Handicap"</a></code><br/>
<h4>Conjunction</h4>
Combine two or more rules with one (or two) "&"-sign(s) or the word "and" if all rules must match an item or card.<br/>
Example:<br/>
<code><a class='query item'>{Level} &gt; 6 and {Level} &lt;= 12 and [Rarity] =~"o"</a> (find items that the Kyburz Market sells)</code>
<h4>Disjunction</h4>
Combine two or more rules with one (or two) "|"-sign(s) or the word "or" if it is enough for one rule to match an item or card.<br/>
Example:<br/>
<code><a class='query item'>[Slot] =~ "Weapon" or [Slot] == "Staff"</a> (find items with six cards)</code>
<h4>Exclusive Disjunction</h4>
Combine exactly two rules with the "^"-sign or the word "xor" if either one of the rules has to match but not both at the same time.<br/>
Example:<br/>
<code><a class='query'>[]=~"Penetrating" xor []=~"Unblockable"</a> (find cards that are either penetrating or unblockable but not both penetrating and unblockable)</code>
<h4>Grouping</h4>
Use parentheses to define groups.<br/>
Example:<br/>
<code><a class='query item'>[Slot] == "Weapon" and {Level} &lt;= 6 and ([Rarity] == "Common" or [Rarity] == "Uncommon")</a> (find easy to collect weapons)</code><br/>
This is especially important to take control over the evaluation order.
A negation only applies to the next atomic rule.
If you wish to negate the result of another rule combination you have to group the combination and write the not in front of the group:<br/>
<code><a class='query item'>not ([Rarity] == "Common" or [Rarity] == "Uncommon")</a> (will exclude the most regular drops)</code><br/>
Furthermore do the types of rule combination have different binding strengths.
They are ordered like: not &gt; and &gt; xor &gt; or.
Hence (given some simple checking rules <code>a</code>, <code>b</code>, <code>c</code>, <code>d</code>), the filter <code>not a or b and c xor d</code> is evaluated as <code>(not a) or ((b and c) xor d)</code>.
If you want or need another order of evaluation you have to add groups to your filter manually.
<h3>Checking Rule Compositions</h3>
This segment introduces some very advanced techniques that are necessary to build the most powerful filters.
There are use cases where these techniques are really necessary, in others you could build your filter without them but you'll get a (much) longer filter.
If you haven't executed any filters yet, I would advise you to skip this segment and try out the other parts first.
<h4>Items with Cards and Cards of Items</h4>
Until now it seemed as if testing an item or a card is done in the same style.
But this isn't the whole truth.
For the card and item query tool you can explicitly choose to find cards or items matching the given filter.
The collection analysis tool will only apply the filter to items.
Hence, all shown rules are valid syntax but only applicable in the correct context.
But of course, there is also a way to apply card rules to all cards of an item or an item rule to all items that contain the given card.
An item has three or six cards, therefore, you have to specify how many cards have to match in case you want to use a card rule on an item.
Specifying this quantifier is done with the following syntax:<br/>
<code>&lt;quantifier&gt; rule<br/>
quantifier: "!" (all cards match) or "?" (at least one card matches) or a number or a range separated with the "~"-sign (like 2~3)<br/>
rule: either a simple checking rule or a composed expression in parentheses</code><br/>
Examples:<br/>
<code><a class='query item'>&lt;?&gt;[Types] =~ "Block"</a> (find items with a block card)<br/>
<a class='query item'>&lt;!&gt;({Range} &gt; 5 or [Types] == "Assist")</a> (find items with only assists or long range cards, but the items don't have to be strict assist items or long range items, every combination of assists and long ranged is fine)<br/>
<a class='query item'>&lt;2&gt;[Card Name] == "Chop"</a> (find items with exactly two Chops (the 5-damage variant only, there may or may not be other chops, too on this item))<br/>
<a class='query item'>&lt;3~6&gt;[] =~ "Penetrating"</a> (find items with at least three penetrating cards)</code><br/>
The same is possible to check all items with a certain card:<br/>
<code><a class='query'>&lt;!&gt;{Level} &gt; 18</a> (find cards that are only available on items with a level above 18 or no item at all)</code><br/>
Sometimes you don't want to apply a certain rule to all cards of an item or all items with a card but want to simply count them.
In this case you can use the described rule syntax but more or less omit the actual rule.
To signalize this you use "( )" as your rule.<br/>
<code><a class='query item'>&lt;3&gt;( )</a> (find items with three cards on them)<br/>
<a class='query'>&lt;?&gt;( )</a> (find cards that are contained on some item(s))</code>
<h4>Remembering rules</h4>
All previous mentioned checking rules already give you a large tool set for creating very powerful filters.
But there is still one big problem, you can only test against pre-defined values.
But what if you want to find items that only feature one card multiple times?
Given that there are a lot of different cards you would have to create a very large filter rule that is combined of a check if card A is the only card on the item or if card B is the only card on the item or if card C ... .
This is the point where the remembering rule comes into play.
The remembering rule has the following syntax:<br/>
<code>binding ~&gt; rule<br/>
binding: @column-header#number or @@( with multiple of the simple bindings in here )<br/>
rule: either a simple checking rule or a composed expression in parentheses</code><br/>
In most other parts of the filter you may freely place spaces in order to create a more appealing or readable impression, but in places where you are naming column-headers you have to take care to not accidentally add spaces where there aren't any in the header.
Whereas in the simple checking rules the brackets serve as header delimiter, the <code>@...#</code>-construct here is the header delimiter so you can't add additional spaces in between that aren't part of the column header.
Similarly the <code>#number</code>-construct forms a unit you can't tear apart by spaces, hence, a simple binding can only be written this one way.
If you make use of the multi-binding-variant ( <code>@@(...)</code> ) you can either write the simple bindings with or without spaces in between.
If a value is bound to a number you can test against it using the notation <code>#number</code>.<br/>
Examples:<br/>
<code><a class='query item'>@Card 1#0 ~&gt; ([Card 2] == #0 and [Card 3] == #0)</a> (find items where the first three cards are identical regardless of the concrete card used)<br/>
<a class='query item'>@@( @Card 1#1 @Card 3#3) ~&gt; ([Card 2] == #1 or [Card 2] == #3)</a> (find items where the second card is either the same as the first or the third)<br/>
<a class='query'>@Duration#0 ~&gt; {Damage} &lt; #0</a> (find cards that inflict less direct damage than the number of rounds they stay attached)</code><br/>
Note that the last filter will automatically filter out every card that either declares no Duration or no Damage.
If your filter would handle cards with an empty column wrong, you again have to include separate empty checks.
You can use any non-negative integer as the number to bind a value to.
If you happen to use the same number twice the old bound value can be shadowed temporarily.
<h4>Compare with whole card/item pool</h4>
If you're working on an item or a card and you want to know if this one is unique or special in some way it is quite hard to compare it to others of the same type.
Sure, you can compare a card to other cards by fetching the items with the first card and then check all the cards on those items (or the other way around if you start with items and want to compare them to other items).
But this has several shortcomings:
You will check several cards or items multiple times.
You have to think about how to reach all cards or items that may be relevant.
If your starting item or card is pretty unique you'll not find many associated cards or items.
If you want to compare cards that aren't printed on items you're lost.
Therefore, there is a syntax that omits the necessity of an <code>&lt;?&gt;&lt;?&gt;</code>-operator and checks your card against every card and your item against every item.
As this is somewhat similar to the "Items with Cards and Cards of Items" segment the operator and syntax are also alike:<br/>
<code>&gt;quantifier&lt; rule<br/>
quantifier: "!" (all cards/items match) or "?" (at least one card/item matches) or a number or a range separated with the "~"-sign (like 2~3)<br/>
rule: either a simple checking rule or a composed expression in parentheses</code><br/>
As you can imagine this time omitting the rule will make no sense as the count of cards and items is static and has no benefit for your filter, so there always has to be a rule.<br/>
Examples:<br/>
<code><a class='query'>@Card Name#0 ~&gt; &gt;2&lt;[Card Name]=~#0</a> (find cards that have exactly one 'sibling' - an other card that has the same name except for some additional parts, like "Team Heal" and the enemy-only card "Super Team Heal")<br/>
<a class='query item retImage retSlot'>@@(@Slot#0 @Image#1) ~&gt; &gt;?&lt;([Slot]!=#0 and [Image]==#1)</a> (find items that reuse images of another slot's item)</code>
<h3>The Keep's Filter</h3>
Now that we have build our own first filters let's conclude the segment about the syntax with a comparison of the custom filters and the Keep's filter.
The custom filter and the Keep's filter both have their advantages and disadvantages.
The Keep focuses on easy to use filtering including some regular expression features.
The custom filter allows explicit negation, conjunction, disjunction and last but not least specific field matching.
Emulating a custom filter with the Keep's filter is impossible in general because the Keep's filter can't limit itself to some specific field(s) or allows to conjunct several checks.
If you want to (roughly) emulate the Keep's filter with a custom filter you can use the following pattern but this will only work for simple word/text filtering (assuming you search for the term "Reliable" in the Keep):<br/>
<code><a class='query item'>[] =~ "Reliable" or &lt;?&gt;[] =~ "Reliable"</a></code>
<a id='Scenarios' class='anchor'></a><h2>Concrete Scenarios [<a href='#top'>top</a>]</h2>
In this section you'll find some concrete scenarios together with a custom filter that solves the described problem.
There may be several solutions for each problem, so this will only be ONE possible solution.
<h3>Immunities</h3>
There are some nasty creatures with tricky armor.
Especially immunities against piercing damage is tough because this prevents almost all penetrating warrior attacks.
Don't want to equip armor removal or you don't have much of those cards? Work around the immunity:<br/>
<code><a class='query item'>&lt;!&gt;[Damage Type] != "Piercing"</a> (all cards of an item may not use piercing damage type)</code><br/>
This will remove all items that use any number of piercing damage but cards like Spiked Mail will still show up (although the spiked effect won't work if the enemy has an immunity in hand).
<h3>Bad Luck</h3>
Some enemies use "Bad Luck", some players just have it regardless of the card.
Using unreliable blocks won't yield good results in this situation.
But if you only equip cards with a high success rate the blocks have to trigger eventually:<br/>
<code><a class='query item'>&lt;!&gt;(([Trigger] == "" or {Trigger} &lt;=3) and ([Trigger 2] == "" or {Trigger 2} &lt;=3))</a></code><br/>
This is another example for a textual empty-check together with a number condition.
In case the entry is empty (because it's a pure attack card for example) the filter will accept it.
If there is some data present it has to match the condition.
As cards can have multiple effects needing a die rolls the filter has to check both trigger columns.
<h3>Handicap [and ...]</h3>
The developers think it may be tricky to complete the adventures with handicaps in hand.
Prove them wrong.
But how to find handicap cards?<br/>
<code><a class='query item'>&lt;?&gt;[Types] =~ "Handicap"</a> (some cards of an item must be handicaps)</code><br/>
This will list items with handicap cards, both pure handicaps and hybrids.
And it will only find cards that are of type handicap and not cards that involve handicaps (like Lateral Thinking).
Or do you prefer hybrid handicaps?<br/>
<code><a class='query item'>&lt;?&gt;([Types] =~ "Handicap" and [Types] =~ ",")</a> (some cards of an item must be hybrid handicaps)</code><br/>
If there is a comma in the types column you have a hybrid card, so conjunct both rules to find hybrid handicaps.
Including further conditions isn't any problem now:<br/>
<code><a class='query item'>&lt;?&gt;[Types] =~ "Handicap" and &lt;?&gt;[Card Name] =~ "Bash"</a> (items with both handicaps and bashes)</code><br/>
Combine this with the next scenario to maximize the number of bash cards.
<h3>Max Build</h3>
For some synergy effects it is important to equip as many cards of some type as possible.
Class Skills are good examples for that.
When facing many enemies chops are great because they more or less double the damage.
But, how many chops are enough?<br/>
<code><a class='query item'>&lt;3 ~ 6&gt;[Card Name] =~ "Chop"</a> (find items with three or more chop cards)</code><br/>
You can focus on strong chops for further boosts, but having three or more chop cards on each weapon yields a minimum of 9 chops in your deck.
Facing blocks? Consider to exclude the clumsy ones from the selection:<br/>
<code><a class='query item'>&lt;3 ~ 6&gt;[Card Name] =~ "Chop" and &lt;0&gt;[Card Name] =~ "Clumsy"</a> (to exclude them completely) <i>or</i><br/>
<a class='query item'>&lt;3 ~ 6&gt;([Card Name] =~ "Chop" and [Card Name] !~ "Clumsy")</a> (to allow them but exclude them from the calculated chop-card-count)</code>
<h3>Power Token</h3>
You are running an adventure of level 12 or below? Then all your items with major power token requirement won't be equippable:<br/>
<code><a class='query item'>{Talent 1} &lt;= 1</a> (check the first power token column for minor power token or none)</code><br/>
The important thing in this case is that the description file doesn't know what power tokens are but it declares talents (perhaps an old terminology?).
This works well because the second power token (if any) is always of the same power level or below.
With only a little adaption you can also find items with no power tokens.
<h3>Buying items from Shops</h3>
Most of you won't remember the time where you're renown wasn't at max.
But back in the days it was quite expensive to buy powerful equipment.
Use the following filter to check if you're missing items that you could buy for the regular price.<br/>
<code><a class='query item'>{Level} &lt;= 14</a> (find items of level 14 or below)</code><br/>
If your renown is at 13 the above filter lists all items with regular price.
You have to add 1 to your renown yourself in order to formulate the rule.
<h3>Farming Adventures</h3>
The renown controls some further effect.
You won't find items in adventure loot whose introductory level is above your renown.
Such items may drop from MP chests but campaigning won't earn you one of them (normally).
Want to know if you have found all items that may drop? Add this rule:<br/>
<code><a class='query item'>{Introductory Level} &lt;= 13</a> (find items that require renown of 13 or below)</code><br/>
This time you have to check against the exact renown (no further additions).
<h3>No unique cards - Build</h3>
If you decide to include a card in your build you usually do this for a reason.
So why limit yourself to a single copy of each card?
Let's find items (with six cards) where each card in included at least twice.
I won't include the six-card check in the filter as this is quite complex as is.<br/>
<code><a class='query item'>@Equipment Name#0 ~&gt; &lt;!&gt;( @Card Name#1 ~&gt; &lt;?&gt;( [Equipment Name] == #0 and <2~6>([Card Name] == #1)))</a></code><br/>
Let's explain this piece by piece.
We start on item level (as this is the information we are looking for in the end) and remember the item's name (remembering the item's id would be possible to, but as cards have an id, too, this will get hard to understand very quickly).
We wanted that each card is present at least twice.
This certainly applies to all cards so we use the &lt;!&gt; quantifier.
Now we are on card level but on card level we can't check the other cards of the item.
So we use a little trick and just remember the card's name.
We know that there is a certain item with the active card that we are interested in, so we write exactly this:
There is an item with this card and this item has the same name as the item we started with.
We are finally back at the item we started with but we have another remembered name: some card of this item.
So, all we have to do is to check whether at least two cards have the card name we remembered.
Here, we don't ask for something like "another card with the same name", that would be impossible with the given syntax, but we just ask for "at least two with the remembered name", which, in the end, yields the same result.<br/>
You can apply the same filter to items with three cards but then the result will be items with the same card three times (you can't have two different cards at least twice on an item with only three cards), but that would be way easier to achieve.<br/>
Just think a minute about the possible combinations we would have to check without the remembering: 1==2 and 3==4 and 5==6 or 1==2 and 2==3 and 4==5 and 5==6 or ... .
<h3>Further scenarios?</h3>
Have you found other brilliant filters you want to share with the community?
Write me and I'll consider to add them to this cheat sheet.
Or are you trying to write a filter but it doesn't want to work as expected?
Write me, too and I'll help you (and perhaps the resulted filter will be added as some kind of FAQ for others).
<a id='Grammar' class='anchor'></a><h2>The Grammar - the Techy Part of the Cheat Sheet [<a href='#top'>top</a>]</h2>
The syntax of custom filters is defined as a formal grammar.
The corresponding parser is generated by <a href="http://www.pegjs.org/online">the online version of PEG.js</a>.
The concrete grammar is defined as follows (if you dive deep into the grammar you'll find some further tricks):<br/>
<code>
	Filter = _ Or _ / _<br/>
	Or = And (_ ('|' '|'? / 'OR'i) _ And)*<br/>
	And = Xor (_ ('&amp;' '&amp;'? / 'AND'i) _ Xor)*<br/>
	Xor = Not _ ('^' / 'XOR'i) _ Not / Not<br/>
	Not = ('!' / 'NOT'i) _ Not / Group<br/>
	Group = '(' _ Or _ ')' / Rule<br/>
	Rule = tRule / nRule / rRule / bRule<br/>
	tRule = '[' Field? ']' _ [=!][=~] _ tVal<br/>
	tVal = String / bID<br/>
	nRule = '{' Field '}' _ nComp _ nVal<br/>
	nComp = [!=]'=' / [&lt;&gt;]'='?<br/>
	nVal = Int / bID<br/>
	rRule = Quantifier _ rPred<br/>
	rPred = Group / '(' _ ')'<br/>
	Quantifier = '&lt;' _ '!' _ '&gt;' / '&lt;' _ '?' _ '&gt;' / '&lt;' _ sNat _ '~' _ sNat _ '&gt;' / '&lt;' _ sNat _ [+-]? _ '&gt;'<br/>
	bRule = Binds _ '~&gt;' _ Group<br/>
	Binds = '@@(' _ (Bind _)+ ')' / Bind<br/>
	Bind = '@' Field bID<br/>
	bID "bind/bound id" = '#' Nat<br/>
	Nat "natural number" = [0-9]+<br/>
	sNat "signed natural number" = '-'? Nat<br/>
	Int "integer" = '-'? Nat<br/>
	Field "field name" = [a-zA-Z0-9_ ]+<br/>
	String "string" = '"' [^\\"]* '"'<br/>
	_ "spaces" = [ \t\n\r]*<br/>
</code>
<a id='Disclaimer' class='anchor'></a><h2>Disclaimer [<a href='#top'>top</a>]</h2>
The grammar and the necessary adaptions to the tools were defined/done by <a href="http://forums.cardhunter.com/members/phoenixthehunter.15760/">PhoenixTheHunter</a>.
Use the tools and this cheat sheet as-provided as help while playing Card Hunter.
But please respect and honor the time and effort this work required by not claiming the results to be yours.
<a id='Contribs' class='anchor'></a><h2>Contributors [<a href='#top'>top</a>]</h2>
Besides PhoenixTheHunter the following community members contributed to this document and they are hereby gratefully acknowledged:
<ul>
<!--
Grab yourself a list item to include your name (together with a link to your forums profile if you like). Keep alphabetical order.
Templates:
<li>Your name</li>
<li><a href="http://forums.cardhunter.com/members/name.00000">Your name</a></li>
-->
<li><a href="http://forums.cardhunter.com/members/gast86.15123/">Gast86</a></li>
<li><a href="http://forums.cardhunter.com/members/kornl.15921/">Kornl</a></li>
<li><a href="http://forums.cardhunter.com/members/sir-veza.4644/">Sir Veza</a></li>
</ul>
</body>
</html>

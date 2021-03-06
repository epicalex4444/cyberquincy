const round2 = require('../jsons/round2.json');
const { cyber } = require('../jsons/colours.json');
const r1 = require('../jsons/rounds.json');
const round = require('../jsons/rounds_topper.json');
const BloonParser = require('../parser/bloon-parser');
const OptionalParser = require('../parser/optional-parser');
const ModeParser = require('../parser/mode-parser');
const AnyOrderParser = require('../parser/any-order-parser');
const { turq } = require('../jsons/colours.json');
module.exports = {
    name: 'bloon',
    aliases: ['bln'],
    execute(message, args) {
        let parsed = CommandParser.parse(
            args,
            new AnyOrderParser(
                new OptionalParser(
                    new ModeParser('CHIMPS', 'ABR'),
                    'CHIMPS' // default if not provided
                ),
                new BloonParser()
            )
        );
        if (parsed.hasErrors()) {
            return module.exports.errorMessage(message, parsed.parsingErrors);
        }
        let object;
        if (parsed.mode == 'CHIMPS') {
            object = round.reg;
        } else {
            object = round.alt;
        }

        function getOccurences(bloon, arrayOfRounds) {
            let occurences = [];
            for (let i = 0; i < 100; i++) {
                roundArray = arrayOfRounds[`${i + 1}`];
                roundRes = [i + 1];

                for (let j = 0; j < roundArray.length; j++) {
                    bloonType = roundArray[j][0].toString();
                    if (bloonType.includes(bloon)) {
                        let number = roundArray[j][1]; // number of bloonType
                        res = [number, bloonType];

                        roundRes.push(res);
                    }
                }
                if (roundRes[1]) occurences.push(roundRes);
            }
            return occurences;
        }
        function format(arr) {
            if (!occurences) {
                throw console.log(
                    `at bloon_occurences.js there is no occurences. Something went through the parser without it detecting. content:${message.content}`
                );
            }
            let bloonType = arr[0][1][1];
            let output = '';
            for (i = 0; i < arr.length; i++) {
                output += '\n';
                output += `Round ${arr[i][0]} : `;
                output += '`{';

                for (j = 1; j < arr[i].length; j++) {
                    output += `${arr[i][j][0]} ${arr[i][j][1]}`;
                    if (j + 1 !== arr[i].length) {
                        // checks for last entry
                        output += ' ';
                    }
                }
                output += '}`';
            }
            let embed = new Discord.MessageEmbed()
                .setTitle(`Occurences of ${bloonType}`)
                .setDescription(output)
                .addField(
                    '"abbreviations"',
                    'cred - camo red; rred - regrow red; fmoab - fortified moab; crred - camo regrow red'
                )
                .setFooter(
                    'each space represents a different set of bloons. For more info use q!round <round>'
                )
                .setColor(turq);
            return embed;
        }
        let occurences = getOccurences(parsed.bloon.toString(), object);
        let output = format(occurences);
        message.channel.send(output);
    },
    errorMessage(message, parsingErrors) {
        let errorEmbed = new Discord.MessageEmbed()
            .setTitle('ERROR')
            .addField('Likely Cause(s)', parsingErrors.join('\n'))
            .setColor(cyber);
        return message.channel.send(errorEmbed);
    },
};

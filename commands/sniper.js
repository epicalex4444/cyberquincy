const t = require('../towers.json')
const Discord = require('discord.js')
const {colour} = require('../config.json')
module.exports = {
	name: 'sniper',
    description: 'sniper upgrades desc', 
    aliases: ['sn','snip'],
    usage:'<path1> <path2> <path3>',
	execute(message, args) {
        let name = 'sniper'
        var path1=Math.floor(parseInt(args[0])/100)
        var path2=Math.floor((parseInt(args[0])-path1*100)/10)
        var path3=parseInt(args[0]-path1*100-path2*10);
        if (path2<1&&path3<1){
            var path =1
        }else if (path1<1&&path3<1){
            var path=2
        }else if (path1<1&&path2<1){
            var path=3
        }
        switch(path){
            case 1: var tier = path1
            break;
            case 2: var tier = path2
            break;
            case 3: var tier = path3
            break;
        }
        var u = t[name][`s${path}${tier}`]
        if (args[0]==='help'){
            message.channel.send(`here is the syntax fo the command: \`\`${name}\`\` \`\`<path1>\`\` \`\`<path2>\`\` \`\`path3>\`\`. please remember that crosspaths are not accepted. All upgrades provided by topper64\'s advanced popology`)
        }else if (path===0||tier==0||args[0]==='base'){
            var u = t[name]['base']
        }if (u === undefined ){
          message.channel.send(`I cant recognise what you sent, here is the syntax fo the command: \`\`${name}\`\` \`\`<path1>\`\` \`\`<path2>\`\` \`\`path3>\`\`. please remember that crosspaths are not accepted. All upgrades provided by topper64\'s advanced popology`)
        }else{
            var tcost = parseInt(t[name].base.cost)
            for(i=tier;i>0;i--){
                tcost = parseInt(t[name][`s${path}${i}`]['cost']) + tcost
            }
            const infoembed = new Discord.RichEmbed()
                .addField('name',`${u.name}`)
                .addField('cost',`$${u.cost} (on medium)`)
                .addField('description',`${u.desc}`)
                .addField(`total cost of all the upgrades (including base tower cost)`,`${tcost} (on medium)`)
                .setColor(colour)
            message.channel.send(infoembed)
        }
    },
};
require('dotenv').config(); 

const{Client,Events,GatewayIntentBits,SlashCommandBuilder,CommandInteraction,MessageEmbed} = require('discord.js');

const channel = process.env.DISCORD_CHANNEL_ID;
const server = process.env.DISCORD_SERVER_ID;

const client= new Client({intents:
        [GatewayIntentBits. Guilds,
        GatewayIntentBits. GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages]});

// クライアントの準備ができたときの処理
client.once(Events.ClientReady,async c=>{
	console.log(`Ready (${c.user.tag})`);

  const guild = client.guilds.cache.get(server);
  await guild.commands.set([]);
    console.log('Commands cleared');
  
  await registerCommands();
});

// 参加の処理
client.on(Events.GuildMemberAdd,member=>{
  if(member.guild.id !== server) return;
    member.guild.channels.cache.get(channel).send(`${member.user}が参加しました`);
});

// 退出の処理
client.on(Events.GuildMemberRemove,member=>{
  if(member.guild.id !== server) return;
    member.guild.channels.cache.get(channel).send(`${member.user.tag}が退出しました`);
});

// メッセージの処理
client.on(Events.MessageCreate, message => {
   
  if (message.author.bot) return;

  const versus = message.content.match(/^(\d+)[Dd](\d+)[Vv](\d+)[Dd](\d+)$/);
  const check = message.content.match(/^(\d+)[Dd](\d+)[Cc](\d+)$/);
  const oppose = message.content.match(/^(\d+)[Oo](\d+)$/);
  const roll = message.content.match(/^(\d+)[Dd](\d+)$/);

    if (versus) {
      const dice_count_1 = parseInt(versus[1]);
      const dice_face_1 = parseInt(versus[2]);
      const dice_count_2 = parseInt(versus[3]);
      const dice_face_2 = parseInt(versus[4]);

      if ( dice_count_1 <= 0 || dice_face_1 <= 0 || dice_count_2 <= 0 || dice_face_2 <= 0) {
        message.channel.send("値が不正です。例: 2d6v2d6");
        return;
      }
      const dices_1 = [];
      for (let i = 0; i < dice_count_1; i++) {
      dices_1.push(Math.floor(Math.random() * dice_face_1) + 1);
      }

      const dices_2 = [];
      for (let i = 0; i < dice_count_2; i++) {
      dices_2.push(Math.floor(Math.random() * dice_face_2) + 1);
      }

	    const total_1 = dices_1.reduce((sum, d) => sum + d, 0);
	    const total_2 = dices_2.reduce((sum, d) => sum + d, 0);

      message.channel.send(
   	  `⚔️ **ダイス比較**\n` +
      `${versus[1]}D${versus[2]} → [${dices_1.join(", ")}] = **${total_1}**\n` +
   	  `${versus[3]}D${versus[4]} → [${dices_2.join(", ")}] = **${total_2}**\n` +
      `結果: **${total_1 > total_2 ? "✅ 成功" : total_1 < total_2 ? "❌ 失敗" : "🤝 引き分け"}**`
      );

    } else if (check) {

      const dice_count_1 = parseInt(check[1]);
      const dice_face_1 = parseInt(check[2]);
      const checkNumber = parseInt(check[3]);

      if ( dice_count_1 <= 0 || dice_face_1 <= 0 || checkNumber <= 0) {
        message.channel.send("値が不正です。例: 2d6c90");
        return;
      }
      const dices_1 = [];
      for (let i = 0; i < dice_count_1; i++) {
      dices_1.push(Math.floor(Math.random() * dice_face_1) + 1);
      }

	    const total_1 = dices_1.reduce((sum, d) => sum + d, 0);

      let resultText;
      if (total_1 < checkNumber) {
      resultText = `✅ **成功**`;
      } else {
      resultText = `❌ **失敗**`;
      }

      message.channel.send(
   	  `🔍 **スキルチェック**\n` +
      `${check[1]}D${check[2]} → [${dices_1.join(", ")}] = **${total_1}** < ${checkNumber}\n` +
      `結果: ${resultText}`);
      
    } else if (oppose) {

      const activeNumber = parseInt(oppose[1]);
      const passiveNumber = parseInt(oppose[2]);

      if (activeNumber <= 0 || passiveNumber <= 0) {
        message.channel.send("値が不正です。例: 10o8");
        return;
      }

      const correctionValue = (activeNumber - passiveNumber) * 5;
      const targetValue = 50 + correctionValue;
      const dice = Math.floor(Math.random() * 100) + 1;

      let resultText;
      // 成功値が100以上なら自動成功、0以下なら自動失敗
      // それ以外はダイスと成功値を比較して成功か失敗かを判断
      // let 変数名; でundefinedを初期値とすることで、条件分岐の中で値を代入していくことができる
      if (targetValue >= 100) {
        resultText = `成功値: **${targetValue}** → 自動成功 ✅`;
      } else if (targetValue <= 0) {
        resultText = `成功値: **${targetValue}** → 自動失敗 ❌`;
      } else {
        const isSuccess = dice <= targetValue;
        resultText = `成功値: **${targetValue}**\nダイス: **${dice}** → ${isSuccess ? "✅ 成功" : "❌ 失敗"}`;
      }

      message.channel.send(
        `🤼 **対抗ロール**\n` +
        `能動側: ${activeNumber} / 受動側: ${passiveNumber}\n` +
        `補正値: ${correctionValue >= 0 ? "+" : ""}${correctionValue}%\n` +
        resultText
      );

    } else if (roll) {
      const dice_count = parseInt(roll[1]);
      const dice_face = parseInt(roll[2]);

      if (dice_count <= 0 || dice_face <= 0) {
      message.channel.send("値が不正です。例: `2d6`");
      return;
      }

      const dices = [];
      for (let i = 0; i < dice_count; i++) {
      dices.push(Math.floor(Math.random() * dice_face) + 1);
      }
    
      const total = dices.reduce((sum, d) => sum + d, 0);
      message.channel.send(
        `🎲 **ダイスロール**\n` +
        `${roll[1]}D${roll[2]} → [${dices.join(", ")}] = **${total}**`);
    }

    if (message.content.match("ぬるぽ")) {
      message.channel.send("ガッ");
    }

});

// スラッシュコマンドの登録
async function registerCommands(){
    const commands = [
      { name: 'help', description: 'ヘルプを表示' },
      { name: 'status', description: 'ランダムなステータスを生成' },
    ];

    try{
        const guild = client.guilds.cache.get(server);
        await guild.commands.set(commands);
        console.log('Commands registered');
    }catch(error){
        console.log('Failed to register commands:', error);        
    }
}
  
  // インタラクション（コマンド）の処理
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
  
    // コマンドの処理
    if (commandName === 'help') {
      const helpText = [
    '使い方:',
    '- `XdY` 任意の個数、面でダイスロール (例: `2d6`)',
    '- `XdYcZ` スキルチェック (例: `1d100v70`)',
    '- `XoY` 能動側X、受動側Yで対抗ダイス (例: `10o8`)',
    '- `XdYvAdB` 任意の個数、面のダイス同士で比較 (例: `3d6v10d6`)',
    '- `ぬるぽ` ???',
      ].join('\n');
      await interaction.reply(helpText);
        } else if (commandName === 'status') {
        let a, b, c, d, e;
        do {
            a = Math.floor(Math.random() * 31) + 5;
            b = Math.floor(Math.random() * 31) + 5;
            c = Math.floor(Math.random() * 31) + 5;
            d = Math.floor(Math.random() * 31) + 5;
            e = Math.floor(Math.random() * 31) + 5;
        } while (a + b + c + d + e !== 125);

        const f = e * 10; 
        await interaction.reply(`STR:${a}\nAGI:${b}\nSPD:${c}\nMEP:${d}\nHP:${f}`);
    }

});

client.login(process.env.DISCORD_TOKEN); 

//ここで終了

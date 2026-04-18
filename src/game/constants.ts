export const CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAYER_SIZE: 50,
  ENEMY_SIZE: 40,
  BULLET_SIZE: 25,
  ROWS: 5,
  COLS: 9,
  COOLDOWN: 800,
  LEVELS: [
    {
      name: "Qualità e Pasti",
      bgColor: "#1a1605",
      emojis: ["🍎", "🥪", "🥛", "🍳", "🍌"],
      speed: 0.7,
      drop: 15,
      bossEmoji: "🌭",
      bombEmoji: "🥓",
      bombSpeed: 4,
      bossHp: 15,
      notions: [
        { text: "Durante la notte il fegato consuma le sue scorte. Al risveglio devi mangiare per ricaricare l'energia.", q: "Perché è importantissimo fare colazione appena ti svegli?", options: ["🔋 Per ricaricare le scorte di energia del corpo", "📺 Per guardare meglio la televisione", "🏃 Per correre più veloce degli altri"], correct: 0, tf_q: "Vero o Falso: Devi fare colazione appena ti svegli per ricaricare le energie.", tf_correct: 0 },
        { text: "L'energia che mangiamo va divisa in 5 momenti durante la giornata per non stancare il corpo.", q: "Perché è meglio dividere il cibo in 5 pasti al giorno?", options: ["🍕 Per poter mangiare pizza 5 volte", "⚖️ Per non appesantire la digestione", "😴 Per fare 5 pisolini al giorno"], correct: 1, tf_q: "Vero o Falso: È meglio mangiare tutto il nostro cibo in un unico pasto gigante.", tf_correct: 1 },
        { text: "Non esistono cibi miracolosi! Scegliere cibi di colori diversi ci aiuta a stare in salute.", q: "Qual è un'ottima regola per mangiare in modo salutare?", options: ["🎨 Mangiare alimenti di tanti colori diversi", "🍫 Mangiare solamente cioccolato", "🧊 Mangiare solo cose fredde"], correct: 0, tf_q: "Vero o Falso: Mangiare cibi di colori diversi ci aiuta a stare in salute.", tf_correct: 0 },
        { text: "Le proteine (come carne, uova o legumi) sono fondamentali: ci danno 4 kcal per grammo e costruiscono il nostro corpo.", q: "Qual è il compito principale delle proteine nel nostro corpo?", options: ["🔥 Dare energia per bruciare i grassi", "🧱 Costruire e riparare i tessuti del corpo", "💧 Dissetare quando abbiamo sete"], correct: 1, tf_q: "Vero o Falso: Le proteine aiutano a costruire e riparare il nostro corpo.", tf_correct: 0 },
        { text: "I grassi (lipidi) sono una grandissima riserva di energia. Ci danno ben 9 chilocalorie per ogni grammo!", q: "Tra questi nutrienti, quale ci dà più energia (chilocalorie) in assoluto?", options: ["🍞 I carboidrati (glucidi)", "🥩 Le proteine (protidi)", "🧈 I grassi (lipidi)"], correct: 2, tf_q: "Vero o Falso: I grassi non ci danno assolutamente nessuna energia.", tf_correct: 1 }
      ]
    },
    {
      name: "Metabolismo",
      bgColor: "#1a0a0a",
      emojis: ["🍎", "🥪", "🥛", "🍳", "🍌"],
      speed: 1.0,
      drop: 20,
      bossEmoji: "🍟",
      bombEmoji: "🍔",
      bombSpeed: 7,
      bossHp: 20,
      notions: [
        { text: "Il Metabolismo Basale è l'energia minima che serve al corpo a riposo per restare vivo (come per respirare o far battere il cuore).", q: "Che cos'è il Metabolismo Basale?", options: ["🛌 L'energia che usiamo quando siamo completamente a riposo", "🏃 L'energia che usiamo per fare una corsa veloce", "🗣️ L'energia che ci serve per parlare ad alta voce"], correct: 0, tf_q: "Vero o Falso: Il nostro corpo consuma energia anche quando stiamo sdraiati a riposo.", tf_correct: 0 },
        { text: "I muscoli consumano tantissima energia! Avere più muscoli (massa magra) fa aumentare molto il tuo metabolismo.", q: "Quale parte del nostro corpo consuma molta energia, anche quando siamo fermi?", options: ["👁️ Gli occhi", "💪 I muscoli (la massa magra)", "💇 I capelli"], correct: 1, tf_q: "Vero o Falso: Avere più muscoli fa consumare molta più energia al nostro corpo.", tf_correct: 0 },
        { text: "Incredibile: il nostro corpo usa circa il 10% della sua energia totale solo per il lavoro di digerire il cibo!", q: "Il nostro corpo consuma energia per digerire il cibo che mangiamo?", options: ["✅ Sì, usa circa il 10% della sua energia solo per digerire", "❌ No, digerire non costa nessuna fatica", "🤔 Solo se mangiamo cibo molto caldo"], correct: 0, tf_q: "Vero o Falso: Digerire il cibo non costa assolutamente nessuna fatica al corpo.", tf_correct: 1 },
        { text: "Il tuo fabbisogno totale di energia si calcola moltiplicando l'energia di base (MB) per quanto ti muovi (LAF).", q: "Da cosa dipende l'energia totale di cui hai bisogno ogni giorno?", options: ["🌞 Dal tempo che fa fuori in strada", "🏃 Dal Metabolismo di base moltiplicato per quanto ci muoviamo", "📅 Dal giorno della settimana in cui siamo"], correct: 1, tf_q: "Vero o Falso: Più sport e movimento fai, più energia ti serve ogni giorno.", tf_correct: 0 },
        { text: "I bambini hanno un Metabolismo Basale altissimo perché stanno crescendo. Dopo i 50 anni, l'energia usata inizia a diminuire.", q: "In quale fase della vita il Metabolismo Basale è più alto?", options: ["👶 Nei bambini", "👴 Nelle persone molto anziane", "🧑 Negli adulti di 50 anni"], correct: 0, tf_q: "Vero o Falso: I bambini non consumano nessuna energia perché sono troppo piccoli.", tf_correct: 1 }
      ]
    },
    {
      name: "Bilancio ed Energia",
      bgColor: "#050a1a",
      emojis: ["🍎", "🥪", "🥛", "🍳", "🍌"],
      speed: 1.3,
      drop: 25,
      bossEmoji: "🍟",
      bombEmoji: "🍟",
      bombSpeed: 5,
      bossHp: 25,
      notions: [
        { text: "Il tuo corpo funziona come un conto in banca: il cibo che mangi è un 'deposito' e il movimento che fai è un 'prelievo'.", q: "A cosa possiamo paragonare il corpo per capire l'energia?", options: ["🏦 A un conto in banca con depositi e prelievi", "🚗 A una automobile senza ruote", "🎈 A un palloncino che vola via"], correct: 0, tf_q: "Vero o Falso: Il cibo che mangiamo funziona come un 'deposito' di energia nel corpo.", tf_correct: 0 },
        { text: "Bilancio in Pareggio: se mangi l'esatta quantità di energia che consumi muovendoti, il tuo peso rimane costante.", q: "Cosa succede se consumi la stessa esatta quantità di energia che mangi?", options: ["📈 Il tuo peso sale rapidamente", "📉 Il tuo peso scende velocemente", "⚖️ Il tuo peso rimane costante (non cambia)"], correct: 2, tf_q: "Vero o Falso: Se consumi tutta l'energia che mangi, il tuo peso rimane perfettamente uguale.", tf_correct: 0 },
        { text: "Bilancio Positivo: se 'depositi' più energia mangiando rispetto a quella che 'prelevi' muovendoti, il corpo la conserva come grasso.", q: "Cosa succede nel 'Bilancio Positivo' (quando mangi di più di quello che consumi)?", options: ["⚡ Diventi improvvisamente elettrico", "🏃 Dimagrisci in modo molto veloce", "📈 Il corpo accumula il grasso e il peso aumenta"], correct: 2, tf_q: "Vero o Falso: Se mangi tantissimo cibo e non ti muovi mai, il tuo corpo dimagrisce.", tf_correct: 1 },
        { text: "L'Indice di Massa Corporea (IMC) è un numero speciale calcolato dagli esperti per capire la tua condizione fisica.", q: "Quali due misure del corpo usa l'Indice di Massa Corporea (IMC)?", options: ["📏 Il peso e l'altezza", "🦶 La misura delle scarpe e l'età", "👁️ Il colore degli occhi e dei capelli"], correct: 0, tf_q: "Vero o Falso: L'Indice di Massa Corporea usa la tua altezza e il tuo peso per valutare la salute.", tf_correct: 0 },
        { text: "L'Indice di Massa Corporea (IMC) ci aiuta a capire se siamo in Sottopeso, Normopeso, Sovrappeso o Obesità per prevenire malattie.", q: "Qual è la condizione ideale per mantenere il corpo in salute secondo l'IMC?", options: ["⚖️ Essere in Normopeso", "🍔 Essere in Sovrappeso", "🎈 Essere in Sottopeso"], correct: 0, tf_q: "Vero o Falso: L'obesità è la condizione ideale per mantenere il corpo sano e forte.", tf_correct: 1 }
      ]
    }
  ]
};

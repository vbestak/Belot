export default {
    id: 0,
    score: { 
        mi: 0,
        vi: 0,
        total: {
            mi:0,
            vi:0
        }
    },
    cardSlots: {
        cardSlot1: "",
        cardSlot2: "",
        cardSlot3: "",
        cardSlot4: ""
    },
    players: [{slot:"0"}, {slot:"1"}, {slot:"2"}, {slot:"3"}],
    playerCards: ["has"],
    trump: "h",
    playerCalled:{},
    trumpCalling: false,
    playerSlotTurn: 0,
    playerSlotShuffling: 3
}
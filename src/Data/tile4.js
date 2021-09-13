export const tile4 = {
  "id": "4",
  "entrySide": "left",
  "spaces": [
    [{
      "type": "barrier",
    },
    {
      "type": "teleporter",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "right",
          "left"
        ],
        "color": "orange"
      }
    },
    {
      "type": "barrier"
    },
    {
      "type": "barrier"
    }],
    [{
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "down"
        ],
        "isEntry": true
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false
      }
    },
    {
      "type": "timer",
      "details": {
        "isOccupied": false,
        "isDisabled": false,
        "sideWalls": [
          "up",
          "right",
          "down"
        ]
      }
    },
    {
      "type": "barrier"
    }],
    [{
      "type": "barrier"
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "left"
        ]
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "down"
        ]
      }
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up"
        ],
        "exploreDirection": "right",
        "color": "purple"
      }
    }],
    [{
      "type": "barrier"
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
        ],
        "exploreDirection": "down",
        "color": "green",
        "hasLoudspeaker": true,
        "specialAbility": "weCanTalkAgain"
      }
    },
    {
      "type": "barrier"
    },
    {
      "type": "teleporter",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down",
          "left"
        ],
        "color": "yellow"
      }
    }]
  ]
}
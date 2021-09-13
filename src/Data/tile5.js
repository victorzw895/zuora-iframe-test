export const tile5 = {
  "id": "5",
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
        "color": "purple"
      }
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "down",
          "left"
        ],
        "exploreDirection": "up",
        "color": "yellow"
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "right"
        ]
      }
    }],
    [{
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "right"
        ],
        "isEntry": true
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "left"
        ],
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
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down"
        ]
      }
    }],
    [{
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "down",
          "left"
        ]
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
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "left"
        ],
        "exploreDirection": "right",
        "color": "orange"
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
          "left"
        ],
        "exploreDirection": "down",
        "color": "green",
        "hasLoudspeaker": true,
        "specialAbility": "weCanTalkAgain"
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
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down"
        ]
      }
    }]
  ]
}
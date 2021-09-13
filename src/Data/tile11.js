export const tile11 = {
  "id": "11",
  "entrySide": "right",
  "spaces": [
    [{
      "type": "exit",
      "details": {
        "sideWalls": [
          "right",
          "left"
        ],
        "color": "yellow"
      }
    },
    {
      "type": "barrier",
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
        ],
        "exploreDirection": "up",
        "color": "orange",
      }
    },
    {
      "type": "barrier"
    }],
    [{
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
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down"
        ]
      }
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
        "color": "yellow"
      }
    }],
    [{
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
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
          "right"
        ]
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "left"
        ],
        "isEntry": true
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
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right"
        ],
        "exploreDirection": "down",
        "color": "green",
        "hasLoudspeaker": true,
        "ability": "weCanTalkAgain"
      }
    },
    {
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
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down"
        ]
      }
    }]
  ]
}
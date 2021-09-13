export const tile2 = {
  "id": "2",
  "entrySide": "right",
  "spaces": [
    [{
      "type": "exit",
      "details": {
        "sideWalls": [
          "up",
          "right",
          "left"
        ],
        "color": "purple"
      }
    },
    {
      "type": "barrier",
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
          "right",
          "down",
          "left"
        ],
        "hasEscalator": true
      }
    },
    {
      "type": "barrier",
    },
    {
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
    }],
    [{
      "type": "barrier"
    },
    {
      "type": "barrier",
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
          "down"
        ],
        "isEntry": true
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
          "up",
          "left"
        ],
        "exploreDirection": "down",
        "color": "orange",
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
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
          "down"
        ],
        "color": "green"
      }
    }]
  ]
}
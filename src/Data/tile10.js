export const tile10 = {
  "id": "10",
  "entrySide": "right",
  "spaces": [
    [{
      "type": "barrier"
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
        "color": "yellow",
      }
    },
    {
      "type": "barrier"
    }],
    [{
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
      "type": "barrier",
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "down",
          "left"
        ],
        "hasEscalator": true
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
        "isOccupied": false
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "right"
        ],
        "hasEscalator": true
      }
    },
    {
      "type": "barrier"
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
      "type": "exit",
      "details": {
        "sideWalls": [
          "right",
          "down"
        ],
        "color": "green"
      }
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
        "color": "purple",
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
        "color": "green"
      }
    }]
  ]
}
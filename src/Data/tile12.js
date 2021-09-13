export const tile12 = {
  "id": "12",
  "entrySide": "right",
  "spaces": [
    [{
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
          "right",
          "down"
        ],
        "hasEscalator": true
      }
    },
    {
      "type": "barrier",
    },
    {
      "type": "barrier"
    }],
    [{
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right"
        ],
        "exploreDirection": "left",
        "color": "yellow"
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
          "up",
          "right",
          "left"
        ],
        "hasEscalator": true
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
        "color": "orange"
      }
    }],
    [{
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
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
        ]
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
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
        "color": "orange"
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
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
          "right",
          "down",
          "left"
        ],
        "color": "purple"
      }
    }]
  ]
}
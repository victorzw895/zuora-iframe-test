export const tile7 = {
  "id": "7",
  "entrySide": "down",
  "spaces": [
    [{
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
        "color": "green"
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
          "up",
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
        ],
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "down"
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
      "type": "weapon",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down",
          "left"
        ],
        "color": "orange",
        "weaponStolen": false
      }
    },
    {
      "type": "barrier"
    },
    {
      "type": "barrier"
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "left"
        ],
        "exploreDirection": "right",
        "color": "purple"
      }
    }],
    [{
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
        "isEntry": true,
        "hasEscalator": true
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
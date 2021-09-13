export const tile9 = {
  "id": "9",
  "entrySide": "left",
  "spaces": [
    [{
      "type": "barrier"
    },
    {
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
        "isEntry": true
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
          "down"
        ],
        "isEntry": true
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
      "type": "barrier"
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
        ]
      }
    }],
    [{
      "type": "barrier"
    },
    {
      "type": "barrier"
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
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
        ]
      }
    }],
    [{
      "type": "weapon",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "down",
          "left"
        ],
        "color": "purple",
        "weaponStolen": false
      }
    },
    {
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up"
        ],
        "exploreDirection": "down",
        "color": "yellow"
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
export const tile3 = {
  "id": "3",
  "entrySide": "up",
  "spaces": [
    [{
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
          "right",
          "down"
        ],
        "isEntry": true
      }
    },
    {
      "type": "barrier"
    }],
    [{
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "down"
        ],
        "isEntry": true,
        "exploreDirection": "left",
        "color": "yellow",
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
          "up"
        ]
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
    }],
    [{
      "type": "teleporter",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up",
          "down",
          "left"
        ],
        "color": "green"
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up"
        ]
      }
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
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
        "color": "purple"
      }
    }],
    [{
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
        "color": "orange",
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
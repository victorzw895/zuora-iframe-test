export const tile8 = {
  "id": "8",
  "entrySide": "up",
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
      "type": "exploration",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "down"
        ],
        "exploreDirection": "left",
        "color": "orange"
      }
    },
    {
      "type": "barrier",
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
    },
    {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "right",
          "left"
        ],
      }
    }],
    [{
        "type": "barrier"
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
        "type": "weapon",
        "details": {
          "isOccupied": false,
          "sideWalls": [
            "up",
            "down",
            "left"
          ],
          "color": "green",
          "weaponStolen": false
        }
      },
      {
      "type": "blank",
      "details": {
        "isOccupied": false,
        "sideWalls": [
          "up"
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
          "right",
          "down"
        ],
        "isEntry": true
      }
    }]
  ]
}
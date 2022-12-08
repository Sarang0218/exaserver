# Welcome to the new Meta!

## Websocket Documentation

### Headers

#### **GAME LOGIC**

##### MOVE: [0]

1.  Position
2.  AnimationState


##### BUIlD: [1]

1. Position
2. BuildingType

##### STORAGE_GET: [2]

1. Position

##### STORAGE_INTERACT [3]

1. Position
2. Mode
3. Itemtype

#### **WEB SERVING**

##### HOMEPAGE [A]

1. Location (URL)

##### CHANGE SERVERSET [B]

1. Settings

***Options***:
  - Host        :A
  - Player      :B
  - Webclient   :C

##### REFRESH SERVERSETS [C]


#### Client Handling

R: Return



-- HOST --

Sendback [G]

PlayerLocationData
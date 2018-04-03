<template>
  <div class="board-container">
    <canvas id="board" height="720" width="1280"></canvas>
    <div id="color"><input id='colorpicker'/></div>
    <div id="thickness">
      <label for="thickness">Thickness</label>
      <select name="thickness" id="thick-select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    </div>
    <div id="type">
      <input type="radio" id="point"
      name="type" value="point" checked class="typeCheckbox">
      <label for="point">Point</label>

      <input type="radio" id="line"
      name="type" value="line" class="typeCheckbox">
      <label for="line">Line</label>
    </div>
    <div id="actions">
        <button id="ask-button">Ask for turn</button>
    </div>
    <div id="admin-actions" hidden>
        <button id="reset-button">Reset permission</button>
    </div>
  </div>
</template>

<script src="./Board.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .board-container{
        z-index: 2;
        background-color: #555;
        width: 100%;
        height: 100%;
        position: absolute;
        #board{
            position: absolute;
            top: 0;
            left: 0;
            background-color: #FFF;
            height: 100%;
            width: 100%;
        }
        #thickness{
            position: absolute;
            top: 10px;
            right: 10px;
            color: #FFF;
        }
        #type{
            position: absolute;
            top: 40px;
            right: 10px;
            color: #FFF;
        }
        #color{
            position: absolute;
            top: 65px;
            right: 10px;
        }
        #nick{
            position: absolute;
            top: 100px;
            right: 10px;
        }
        #actions {
            position: absolute;
            top: 150px;
            right: 10px;
        }
        #admin-actions {
            position: absolute;
            top: 150px;
            right: 10px;
        }
    }
</style>

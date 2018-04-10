<template>
  <div class="board-container">
    <canvas id="board" height="720" width="1280"></canvas>
    <v-dialog v-model="petitionDialog" max-width="500">
        <v-card v-if="!secondDialog">
          <v-card-title class="headline">Turn Petition</v-card-title>
          <v-card-text>User {{petitionData.nick}} wants to use the board</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="disapprovePetition(); secondDialog = true">No, disapprove</v-btn>
            <v-btn color="primary" @click.native="approvePetition(); secondDialog = true">Yes, approve</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-card-title class="headline">Turn Petition</v-card-title>
          <v-card-text v-if="answer">You approved user's petition</v-card-text>
          <v-card-text v-else>You disapproved user's petition</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.native.stop="dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="answerDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Turn Petition</v-card-title>
          <v-card-text>User {{petitionData.nick}} wants to use the board</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="disapprovePetition()">No, disapprove</v-btn>
            <v-btn color="primary" @click.native="approvePetition()">Yes, approve</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="petitionDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Turn Petition</v-card-title>
          <v-card-text>User {{petitionData.nick}} wants to use the board</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="disapprovePetition()">No, disapprove</v-btn>
            <v-btn color="primary" @click.native="approvePetition()">Yes, approve</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
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

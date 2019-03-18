<template>
    <div class="tip"  style="top:200px" v-if="showTip">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header" style="background:#40aaf4; border:none;">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeTip">
                  <span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" style="color:#fff; text-align:left;">提示</h4>
              </div>
            <div class="modal-body" style="padding:5% 10% 1%; box-sizing:border-box; background:#2d2d2d;color:#fff; font-size:16px;">
                {{message}}
            </div>
            <div class="modal-footer" style="background:#2d2d2d; border:none;text-align:center;">
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="closeTip">确定</button>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Tip',
  props:["message","showTip"],
  methods:{
    closeTip:function(){
      this.$emit('closeTipEvent');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

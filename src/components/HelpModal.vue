<script setup lang="ts">
defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" role="presentation" @click="$emit('close')">
      <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" @click.stop>
        <div class="help-modal-header">
          <h2 id="help-title">使い方</h2>
          <button
            type="button"
            class="modal-close"
            aria-label="使い方を閉じる"
            data-tooltip="使い方を閉じる"
            @click="$emit('close')"
          >
            閉じる
          </button>
        </div>

        <div class="help-modal-body">
          <section>
            <h3>コメントを表示する</h3>
            <p>アイコン付きのレイアウトメニューで表示形式を選び、編集を押します。各枠の入力欄にYouTubeの動画IDまたはURLを入力して更新します。</p>
          </section>
          <section>
            <h3>IDを変更する</h3>
            <p>編集モード中は各枠の半透明レイヤー上でIDやURLを変更できます。入力欄を空にして更新すると、その枠を未設定にできます。</p>
          </section>
          <section>
            <h3>配置を変える</h3>
            <p>編集モード中に枠そのものをドラッグ&ドロップすると、表示枠の位置を入れ替えられます。</p>
          </section>
          <section>
            <h3>共有する</h3>
            <p>レイアウト変更、D&D、枠内の更新でURLバーが更新されます。共有URLをクリックすると現在のURLをコピーできます。</p>
          </section>
          <section>
            <h3>操作欄を隠す</h3>
            <p>操作欄を隠すを押すと表示領域を広げられます。画面上部の復帰ボタンまたは Esc で操作欄を戻せます。</p>
          </section>
        </div>
      </section>
    </div>
  </Teleport>
</template>

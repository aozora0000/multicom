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
            <p>YouTubeのコメントポップアップURLの仕様上、基本的に現在ライブ中の配信だけコメントを表示できます。通常動画や終了済み配信では表示されないことがあります。</p>
          </section>
          <section>
            <h3>開発</h3>
            <p>
              このアプリは X の
              <a href="https://x.com/kaihatsu0000" target="_blank" rel="noreferrer">@kaihatsu0000</a>
              が作っています。
            </p>
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
            <h3>外部ツールで開く</h3>
            <p>外部レイアウトを選ぶと、現在入力している動画IDを「YouTubeを複数窓でみるやつ」向けのリンク形式にして、動画を開くから移動できます。</p>
            <p>このリンク生成は移動用の補助機能です。このアプリはリンク先サイトとは無関係で、リンク先の動作や仕様変更はこのアプリでは管理していません。</p>
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

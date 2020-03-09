declare module "pixi.js-keyboard" {
  function isKeyDown(
    key: string,
  ): boolean;

  function update(): void;
}
import { UI } from "./ui/ui.js";
import { Game } from "./game/game.js";

(($) => {
    $(document).ready(() => {
        new UI();
        new Game("#viewport");
    });
})(jQuery);

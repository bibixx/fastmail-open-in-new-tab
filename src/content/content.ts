const OPEN_IN_WINDOW_LABEL = 'Open in a new window';
const observer = new MutationObserver(function (mutationsList) {
  mutationsList.forEach((mutation) => {
    if (mutation.type !== 'childList') {
      return;
    }

    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const $labels = Array.from(node.querySelectorAll('.label'));

      if (
        $labels.some(($label) => $label.textContent === OPEN_IN_WINDOW_LABEL)
      ) {
        return;
      }

      const $label = $labels.find(
        ($label) => $label.textContent === 'View as text',
      );

      if ($label === undefined) {
        return;
      }

      const $viewAsTextListItem = $label.closest('li.v-MenuOption');

      if ($viewAsTextListItem === null) {
        return;
      }

      const $openInWindowLabel = document.createElement('span');
      $openInWindowLabel.classList.add('label');
      $openInWindowLabel.textContent = OPEN_IN_WINDOW_LABEL;

      const $openInWindowIcon = document.createElement('svg');

      const $openInWindowButton = document.createElement('button');
      $openInWindowButton.classList.add('v-Button');
      $openInWindowButton.classList.add('has-icon');
      $openInWindowButton.type = 'button';
      $openInWindowButton.tabIndex = 0;
      $openInWindowButton.style.position = 'relative';

      const $openInWindowListItem = document.createElement('li');
      $openInWindowListItem.classList.add('v-MenuOption');
      $openInWindowListItem.style.position = 'relative';

      $openInWindowButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="u-standardicon v-Icon i-forward" role="presentation"><path d="M12.67,9.1s-8.44-.19-7.89,9.15c0,0-.28-5.32,7.89-5.32"></path><polyline points="12.67 12.93 12.67 16.28 19.25 11.01 12.67 5.75 12.67 9.1"></polyline></svg>';
      $openInWindowButton.appendChild($openInWindowIcon);
      $openInWindowButton.appendChild($openInWindowLabel);
      $openInWindowListItem.appendChild($openInWindowButton);

      const $parent = $viewAsTextListItem.parentElement;
      const $nextSibling = $viewAsTextListItem.nextSibling;

      $openInWindowButton.addEventListener('click', () => {
        // Close dropdown
        document.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }),
        );

        const $thread = document.querySelector('.v-Thread');
        if ($thread === null) {
          return;
        }

        const w = window.open('', '', 'popup=true');
        if (w === null) {
          return;
        }

        const $base = w.document.createElement('base');
        $base.href = document.location.href;

        const emailTitle =
          document.querySelector('.v-Thread-title')?.textContent;
        if (emailTitle != null) {
          w.document.title = emailTitle;
        }

        w.document.head.appendChild($base);

        Array.from(document.documentElement.attributes).forEach((attribute) => {
          w.document.documentElement.setAttribute(
            attribute.name,
            attribute.value,
          );
        });

        Array.from(document.body.attributes).forEach((attribute) => {
          w.document.body.setAttribute(attribute.name, attribute.value);
        });

        Array.from(document.querySelectorAll('style')).forEach(($style) => {
          w.document.head.appendChild($style.cloneNode(true));
        });

        w.document.body.appendChild($thread.cloneNode(true));

        const $additionalStyles = w.document.createElement('style');
        $additionalStyles.innerHTML = additionalStyles;

        w.document.head.appendChild($additionalStyles);
      });

      $openInWindowListItem.addEventListener('mouseenter', () => {
        $openInWindowListItem.classList.add('is-focused');
      });

      $openInWindowListItem.addEventListener('mouseleave', () => {
        $openInWindowListItem.classList.remove('is-focused');
      });

      $parent?.insertBefore($openInWindowListItem, $nextSibling);
    });
  });
});

observer.observe(document.body, {
  subtree: false,
  attributes: false,
  childList: true,
});

const additionalStyles = `
html, body {
  overflow: unset;
  height: unset;
}

.app-contentCard-toolbar,
.v-MessageCard-actions button,
.v-MessageCard-toggleDetails {
  display: none !important;
}

.v-Thread {
  margin-bottom: 20px;
}

*:not(.v-Message *) {
  cursor: unset !important;
}

.v-MessageCard-from {
  text-decoration: none !important;
}

.v-MessageCard {
  max-width: unset;
}

.v-MessageCard-folder {
  margin-right: 0;
}
`;

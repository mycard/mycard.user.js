// Generated by CoffeeScript 1.6.2
(function() {
  var $, Card, CardDeck, HTMLNode, HtmlContent, Leaf, Main, Tree, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Card = (function() {
    var card_types, categories, imageExt, imagePath, thumbImagePath, types, _attributes,
      _this = this;

    types = ['warrior', 'spellcaster', 'fairy', 'fiend', 'zombie', 'machine', 'aqua', 'pyro', 'rock', 'winged_beast', 'plant', 'insect', 'thunder', 'dragon', 'beast', 'beast_warrior', 'dinosaur', 'fish', 'sea_serpent', 'reptile', 'psychic', 'divine_beast', 'creator_god'];

    _attributes = ['earth', 'water', 'fire', 'wind', 'light', 'dark', 'divine'];

    categories = ['monster', 'spell', 'trap'];

    card_types = [null, null, null, null, 'normal', 'effect', 'fusion', 'ritual', null, 'spirit', 'union', 'gemini', 'tuner', 'synchro', null, null, 'quick_play', 'continuous', 'equip', 'field', 'counter', 'flip', 'toon', 'xyz'];

    thumbImagePath = 'http://images.my-card.in/thumbnail/';

    imagePath = 'http://images.my-card.in/';

    imageExt = '.jpg';

    Card.cardCache = {};

    Card.batchQueryInfo = function(names, callback) {
      var apiUrl, data, i;

      apiUrl = 'http://my-card.in/cards_zh';
      if (typeof names === 'object' && names.length > 0) {
        if (!(function() {
          var _i, _ref, _results;

          _results = [];
          for (i = _i = 0, _ref = names.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(names[i]);
          }
          return _results;
        })()) {
          names.splice(i, 1);
        }
        data = JSON.stringify({
          "name": {
            "$in": names
          }
        });
        return $.getJSON(apiUrl, {
          q: data
        }, function(res) {
          var info, _i, _len;

          data = {};
          for (_i = 0, _len = res.length; _i < _len; _i++) {
            info = res[_i];
            data[info.name] = info;
          }
          return Card.batchQueryAttr(data, callback);
        });
      }
    };

    Card.batchQueryAttr = function(cards, callback) {
      var apiUrl, data, ids, nameIndex,
        _this = this;

      apiUrl = 'http://my-card.in/cards';
      ids = [];
      nameIndex = {};
      $.each(cards, function(i, card) {
        var id;

        if (!(card._id && card.name)) {
          return true;
        }
        id = parseInt(card._id, 10);
        nameIndex[id] = card.name;
        if (id > 0) {
          return ids.push(id);
        }
      });
      data = JSON.stringify({
        "_id": {
          "$in": ids
        }
      });
      return $.getJSON(apiUrl, {
        l: ids.length,
        q: data
      }, function(res) {
        var card, info, name, _i, _len;

        for (_i = 0, _len = res.length; _i < _len; _i++) {
          info = res[_i];
          name = nameIndex[info._id];
          card = cards[name];
          _this.cardCache[name] = new Card(card, info);
        }
        return callback();
      });
    };

    Card.prototype.id = null;

    Card.prototype.alias = null;

    Card.prototype.name = null;

    Card.prototype.category = null;

    Card.prototype.card_type = null;

    Card.prototype.type = null;

    Card.prototype.attribute = null;

    Card.prototype.level = null;

    Card.prototype.atk = null;

    Card.prototype.def = null;

    Card.prototype.description = null;

    Card.image;

    Card.thumb;

    function Card(card, info) {
      var card_type, category, i;

      i = 0;
      while (info.type) {
        if (info.type & 1) {
          if (card_types[i]) {
            card_type = card_types[i];
          }
          if (categories[i]) {
            category = categories[i];
          }
        }
        info.type >>= 1;
        i++;
      }
      this.id = info._id;
      this.alias = info.alias;
      this.name = card.name;
      this.category = category;
      this.card_type = card_type;
      if (info.race) {
        this.type = (i = 0, (function() {
          var _results;

          _results = [];
          while (!(info.race >> i & 1)) {
            _results.push(i++);
          }
          return _results;
        })(), types[i]);
      }
      if (info.attribute) {
        this.attribute = (i = 0, (function() {
          var _results;

          _results = [];
          while (!(info.attribute >> i & 1)) {
            _results.push(i++);
          }
          return _results;
        })(), _attributes[i]);
      }
      if (info.attribute) {
        this.level = info.level;
      }
      if (info.attribute) {
        this.atk = info.atk;
      }
      if (info.attribute) {
        this.def = info.def;
      }
      this.description = card.desc;
      this.image = imagePath + this.id + imageExt;
      this.thumb = thumbImagePath + this.id + imageExt;
    }

    return Card;

  }).call(this);

  CardDeck = (function() {
    var panelName, render;

    panelName = ['主卡组', '副卡组', '额外卡组', '临时卡组'];

    render = function(panel, position) {
      var card, container, deckPart, fieldset, i, img, legend, _i, _j, _len, _ref;

      if (position.left + 528 > document.documentElement.clientWidth) {
        position.left = document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth - 528 : 0;
      }
      container = $('<div></div>').css({
        'position': 'absolute',
        'top': "" + position.top + "px",
        'left': "" + position.left + "px",
        'width': '518px',
        'background': '#FFFFFF'
      });
      for (i = _i = 0; _i < 4; i = ++_i) {
        console.log(i);
        if (!(panel[i] && panel[i].length)) {
          continue;
        }
        fieldset = $('<fieldset></fieldset>').css({
          'height': '295px',
          'background': '#F9F9F9',
          'border-radius': '6px',
          'color': '#666666',
          'font-size': '12px',
          'margin': '14px 0 0',
          'padding': '5px'
        });
        legend = $("<legend>" + panelName[i] + "<small>(" + panel[i].length + ")</small></legend>").css({
          'color': '#666666',
          'font-size': '14px',
          'margin-left': '8px'
        });
        console.log(legend.html());
        legend.children('small').attr('font-size', '10px');
        deckPart = $('<div></div>').attr({
          'margin': '0 -3px 0 -3px'
        });
        _ref = panel[i];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          card = _ref[_j];
          img = $('<img />').attr({
            'width': '44',
            'height': '64',
            'src': card.thumb
          }).css({
            'float': 'left',
            'margin': '0 3px 8px 3px',
            'overflow': 'visible'
          });
          deckPart.append(img);
        }
        container.append(fieldset.append(legend).append(deckPart));
      }
      return $('body').append(container);
    };

    CardDeck.prototype.panel = [];

    CardDeck.prototype.data = null;

    CardDeck.prototype.build = function(callback) {
      var deck, name, position, tmp, _i, _j, _len, _len1, _ref;

      if (!this.data.isMatching) {
        return callback();
      }
      position = $(this.data.startNode).position();
      _ref = this.data.deck;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        deck = _ref[_i];
        tmp = [];
        for (_j = 0, _len1 = deck.length; _j < _len1; _j++) {
          name = deck[_j];
          if (Card.cardCache[name]) {
            tmp.push(Card.cardCache[name]);
          }
        }
        this.panel.push(tmp);
      }
      return render(this.panel, position);
    };

    function CardDeck(data) {
      this.build = __bind(this.build, this);      this.data = data;
    }

    return CardDeck;

  })();

  HtmlContent = (function() {
    var block, breakPoint, domTree, eachDom, eachMatch, featureString, matchLastFeature, matchQueue, record, searchBack;

    block = ['div', 'p', 'article', 'section', '#text'];

    featureString = ['####', '====', '$$$$', null];

    domTree = breakPoint = null;

    matchQueue = [];

    eachDom = function(node, callback) {
      var element, item, _i, _len, _ref;

      element = node.content;
      if (!(element && element.childNodes.length)) {
        return callback(false);
      }
      _ref = element.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (block.indexOf(item.nodeName.toLowerCase()) === -1) {
          continue;
        }
        domTree.setChild(item, node);
      }
      breakPoint = node;
      return eachMatch(node.firstChild(), function() {
        return callback(true);
      });
    };

    eachMatch = function(node, callback) {
      return matchLastFeature(node, function(_break) {
        if (_break || node.next === null) {
          return callback();
        }
        return eachMatch(node.next, callback);
      });
    };

    matchLastFeature = function(node, callback) {
      var element, feature, text;

      feature = featureString[featureString.length - 2];
      element = node.content;
      text = element.innerText || element.textContent;
      if (text.indexOf(feature) === -1) {
        return searchBack(node, 0, function(_res) {
          return callback(_res);
        });
      }
      if (node.content.childNodes && node.content.childNodes.length) {
        return eachDom(node, function(hasChild) {
          if (hasChild) {
            return callback(false);
          }
        });
      }
    };

    searchBack = function(node, layer, callback) {
      var text;

      layer++;
      node = node.parent;
      if (node.parent === null) {
        return callback(false);
      }
      text = node.content.innerText || node.content.textContent;
      if (text.indexOf(featureString[0]) === -1) {
        if (node === breakPoint) {
          return callback(false);
        } else {
          return searchBack(node, layer, callback);
        }
      } else {
        return record(node, layer, function() {
          return callback(true);
        });
      }
    };

    record = function(node, layer, callback) {
      var htmlNode;

      console.log(node.content);
      htmlNode = new HTMLNode(node.content, layer);
      return htmlNode.parse(function() {
        if (htmlNode.isMatching) {
          matchQueue.push(htmlNode);
        }
        return callback();
      });
    };

    HtmlContent.prototype.parse = function(callback) {
      window.domTree = domTree = new Tree(document.body);
      return eachDom(domTree.root, function(res) {
        return callback(matchQueue);
      });
    };

    function HtmlContent() {
      this.parse = __bind(this.parse, this);      true;
    }

    return HtmlContent;

  })();

  HTMLNode = (function() {
    var block, collectionToArray, featureString, filter, findStart, matchDeck, matchItem, self, setNams,
      _this = this;

    self = null;

    HTMLNode.names = [];

    block = ['div', 'p', 'article', 'section', '#text'];

    featureString = ['####', '====', '$$$$', null];

    HTMLNode.prototype.nodeText = null;

    HTMLNode.prototype.container = null;

    HTMLNode.prototype.startNode = null;

    HTMLNode.prototype.deck = [];

    HTMLNode.prototype.layer = 0;

    HTMLNode.prototype.isMatching = false;

    HTMLNode.prototype.cards = [];

    collectionToArray = function(collection) {
      var arr, i, _i, _len;

      arr = [];
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        i = collection[_i];
        arr.push(i);
      }
      return arr;
    };

    findStart = function(element, layer, callback) {
      var child, i, item, nodeArray, startNode, text, tmpArray, _i, _j, _k, _l, _len, _len1, _len2, _ref;

      if (layer === 0) {
        return callback(element);
      }
      nodeArray = [element];
      for (i = _i = 0; 0 <= layer ? _i < layer : _i > layer; i = 0 <= layer ? ++_i : --_i) {
        tmpArray = [];
        for (_j = 0, _len = nodeArray.length; _j < _len; _j++) {
          item = nodeArray[_j];
          _ref = item.childNodes;
          for (_k = 0, _len1 = _ref.length; _k < _len1; _k++) {
            child = _ref[_k];
            if (block.indexOf(child.nodeName.toLowerCase()) === -1) {
              continue;
            }
            tmpArray.push(child);
          }
        }
        nodeArray = tmpArray;
      }
      startNode = null;
      for (_l = 0, _len2 = nodeArray.length; _l < _len2; _l++) {
        item = nodeArray[_l];
        text = item.innerText || item.textContent;
        text = text.trim();
        if (text.indexOf('####') > -1) {
          break;
        }
        if (!text) {
          continue;
        }
        if (text.indexOf('##') > -1) {
          if (startNode === null) {
            startNode = item;
          }
        } else {
          startNode = null;
        }
      }
      if (startNode === null) {
        throw 'no match start node';
      }
      if (startNode.nodeName.toLowerCase() === '#text') {
        startNode = $('<m></m>').insertBefore(startNode);
      }
      return callback(startNode);
    };

    filter = function(nodeText, callback) {
      var end, feature, res, start, text, _i, _len;

      res = [];
      start = end = 0;
      for (_i = 0, _len = featureString.length; _i < _len; _i++) {
        feature = featureString[_i];
        if (feature) {
          end = nodeText.indexOf(feature);
        } else {
          end = nodeText.length;
        }
        if (end === -1) {
          throw 'feature not match';
        }
        text = nodeText.substr(start, end - start);
        start = end;
        if (typeof feature === 'string') {
          start += feature.length;
        }
        res.push(text);
      }
      return callback(res);
    };

    matchDeck = function(input, output, callback) {
      var fromFront, item, items, r, tmp, _i, _len;

      if (input.length === 0) {
        return callback(output);
      }
      items = input.shift().split('##');
      fromFront = input.length === 0;
      tmp = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item = item.trim();
        if (!item) {
          continue;
        }
        r = matchItem(item, fromFront);
        if (fromFront) {
          if (!r) {
            break;
          }
          tmp.push(r);
        } else {
          if (r) {
            tmp.push(r);
          } else {
            tmp = [];
          }
        }
      }
      self.cards = self.cards.concat(tmp);
      output.push(tmp);
      return matchDeck(input, output, callback);
    };

    matchItem = function(item, fromFront) {
      var m, reg;

      reg = fromFront ? /^\[(.*)\]/ : /\[(.*)\]$/;
      m = reg.exec(item.trim());
      if (m) {
        return m[1];
      } else {
        return false;
      }
    };

    setNams = function(names) {
      var name, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        if (HTMLNode.names.indexOf(name) === -1) {
          _results.push(HTMLNode.names.push(name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HTMLNode.prototype.parse = function(callback) {
      var e, nodeText,
        _this = this;

      nodeText = this.container.innerText || this.container.textContent;
      try {
        return filter(nodeText, function(deck) {
          return findStart(_this.container, _this.layer, function(start) {
            _this.startNode = start;
            window.kaze = _this.startNode;
            return matchDeck(deck, [], function(deck) {
              _this.deck = deck;
              _this.isMatching = true;
              setNams(_this.cards);
              return callback();
            });
          });
        });
      } catch (_error) {
        e = _error;
        console.log(e);
        return callback();
      }
    };

    function HTMLNode(node, layer) {
      this.parse = __bind(this.parse, this);      self = this;
      this.container = node;
      this.layer = layer;
    }

    return HTMLNode;

  }).call(this);

  $ = null;

  Main = (function() {
    var jQueryPath, load;

    jQueryPath = 'http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js';

    load = function(path, callback) {
      var scriptElement;

      scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = path;
      scriptElement.onload = function() {
        return callback();
      };
      return document.body.appendChild(scriptElement);
    };

    Main.prototype.start = function() {
      var build, handle, parse;

      $ = jQuery;
      parse = function() {
        var htmlContent;

        htmlContent = new HtmlContent();
        return htmlContent.parse(function(cardQueue) {
          return Card.batchQueryInfo(HTMLNode.names, function() {
            return handle(cardQueue);
          });
        });
      };
      handle = function(cardQueue) {
        if (typeof cardQueue === 'object' && cardQueue.length > 0) {
          return build(cardQueue.shift(), function() {
            return handle(cardQueue);
          });
        }
      };
      build = function(data, callback) {
        var cardDeck;

        cardDeck = new CardDeck(data);
        return cardDeck.build(callback);
      };
      return $(function() {
        return parse();
      });
    };

    function Main() {
      this.start = __bind(this.start, this);
      var _this = this;

      if (typeof jQuery !== 'undefined') {
        this.start();
      } else {
        load(jQueryPath, function() {
          jQuery.noConflict();
          return _this.start();
        });
      }
    }

    return Main;

  })();

  if ((_ref = this.myCardUserJS) == null) {
    this.myCardUserJS = new Main();
  }

  Tree = (function() {
    Tree.prototype.root = null;

    Tree.prototype.setChild = function(content, parentLeaf) {
      var brotherLeaf, newLeaf;

      if (parentLeaf == null) {
        parentLeaf = this.root;
      }
      newLeaf = new Leaf(content);
      if (parentLeaf.children.length) {
        brotherLeaf = parentLeaf.children[parentLeaf.children.length - 1];
        brotherLeaf.next = newLeaf;
        newLeaf.prev = brotherLeaf;
      }
      parentLeaf.children.push(newLeaf);
      newLeaf.parent = parentLeaf;
      return newLeaf;
    };

    function Tree(content) {
      this.setChild = __bind(this.setChild, this);      this.root = new Leaf(content);
    }

    return Tree;

  })();

  Leaf = (function() {
    Leaf.prototype.prev = null;

    Leaf.prototype.next = null;

    Leaf.prototype.parent = null;

    Leaf.prototype.children = [];

    Leaf.prototype.content = null;

    Leaf.prototype.firstChild = function() {
      if (!this.children.length) {
        return false;
      }
      return this.children[0];
    };

    function Leaf(content) {
      this.firstChild = __bind(this.firstChild, this);      this.prev = this.next = this.parent = this.content = null;
      this.children = [];
      this.content = content;
    }

    return Leaf;

  })();

}).call(this);

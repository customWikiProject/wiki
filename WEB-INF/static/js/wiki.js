Array.prototype.unique = function() {
	var a = {};
	for ( var i = 0; i < this.length; i++) {
		if (typeof a[this[i]] == "undefined")
			a[this[i]] = 1;
	}
	this.length = 0;
	for ( var i in a)
		this[this.length] = i;
	return this;
};

/**
 * 위키 네임스페이스
 * Wiki namespace
 */
var Wiki = function() {
};

/**
 * 위키 마크업으로 작성된 문서를 파싱하는 객체
 * Parse document written by wiki markup.
 */
Wiki.Parser = (function() {
	var domain = location.pathname;
	var regexSets = [ {
		//
		type : "headline proof",
		regex : /\[\[(\={1,6})(.*?)\1\]\]/g,
		replaceStatement : "$1 [[$2]] $1"
	}, {
		// link parser [[text]]
		type : "link",
		regex : /\[\[(.*?)\]\]/g,
		replaceStatement : "<a href='" + domain + "?id=$1'>$1</a>"
	},{
		// h1 parser ======text======
		type : "h1",
		regex : /\={6}(.*?)\={6}/g,
		replaceStatement : "<h1>$1</h1><hr>"
	}, {
		// h2 parser =====text=====
		type : "h2",
		regex : /\={5}(.*?)\={5}/g,
		replaceStatement : "<h2>$1</h2><hr>"
	}, {
		// h3 parser ====text====
		type : "h3",
		regex : /\={4}(.*?)\={4}/g,
		replaceStatement : "<h3>$1</h3><hr>"
	}, {
		// h4 parser ===text===
		type : "h4",
		regex : /\={3}(.*?)\={3}/g,
		replaceStatement : "<h4>$1</h4><hr>"
	}, {
		// h5 parser ==text==
		type : "h5",
		regex : /\={2}(.*?)\={2}/g,
		replaceStatement : "<h5>$1</h5><hr>"
	}, {
		// strong parser **text**
		type : "bold",
		regex : /\*{2}(.*?)\*{2}/g,
		replaceStatement : "<strong>$1</strong>"
	} ];
	
	/**
	 * 헤드라인별로 div로 묶는다.
	 * grouping by headline tag.
	 * 
	 * @author YuiNacor
	 * @param {string} 파싱을 수행할 본문 문서
	 * @returns {string} div로 묶은 후의 문서
	 * @version 1.0
	 */
	var makeDomHierarchy = function(string) {
		var regex = /(\={1,6}.*?\={1,6})/g;
		var matchArr = string.match(regex);
		
		//matchArr에서 중복요소를 제거해야 한다.
		matchArr.unique();
		string = string.replace(matchArr[0], "<div>" + matchArr[0]);

		for ( var i = 1, max = matchArr.length; i < max; i++) {
			string = string.replace(matchArr[i], "</div><div>" + matchArr[i]);
		}
		return string;
	};
	
	return {
		/**
		 * 문서 전체의 파싱을 수행
		 * 
		 * @author YuiNaCor
		 * @param {string} 파싱을 수행할 본문 문서
		 * @returns {element} 파싱 후 하나의 div로 랩핑된 문서
		 * @version 1.0
		 */
		replaceAll : function(string) {

			string = makeDomHierarchy(string);

			for ( var i = 0; i < regexSets.length; i++) {
				string = string.replace(regexSets[i].regex,
						regexSets[i].replaceStatement);
			}
			return "<div>" + string + "</div>";
		}
	};
})();






document.getElementById("confirm").addEventListener("click", function(e) {
	var dom = document.getElementById("wikiText");

	document.write(Wiki.Parser.replaceAll(dom.value));
	// document.write("<div>" + Wiki.parser.replaceAll(dom.value) + "</div>");
});
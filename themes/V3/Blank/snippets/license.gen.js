/* eslint-disable max-lines */
const _ = require('lodash');

// Small and one-off licenses
// Licenses in this file consist of one or two functions at most. If something is larger, 
// has more assets, or variations, break it out into a distinct file.

module.exports = {

	mit : function () {
		return dedent`
		{{license,wide
		Copyright \\<YEAR\\> \\<COPYRIGHT HOLDER\\>
		:
		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
		:
		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
		:
		THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		}}`;
	},
	orc1 : function () {
		return dedent`
        {{license,wide,orc
        | | |
        |-|-|
        |ORC Notice|This product is licensed under the ORC License located at the Library of Congress at TX 9-307-067 and available online at various locations including [possible domain names may be inserted] and others. All warranties are disclaimed as set forth therein.
        |Attribution|This product is based on the following Licensed Material:
        |^|[Title of Work], [Copyright Notice], [Author Credit Information].^|
        |^|[Title of Additional Work], [Copyright Notice], [Author Credit Information], [Etc.].^|
        |^|If you use our Licensed Material in your own published works, please credit us as follows:^|
        |^|[Title of This Work], [Copyright Notice], [Your Author Credit Information].^|
        |Reserved Material|Reserved Material elements in this product include, but may not be limited to: 
        |Expressly Designated Licensed|Material	The following elements are owned by the Licensor and would otherwise constitute Reserved Material and are hereby designated as Licensed Material:|
        }}
        `;
	},
	cczero           : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC0](https://creativecommons.org/publicdomain/zero/1.0/)\n\n`,
	ccby             : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC BY 4.0](https://creativecommons.org/publicdomain/by/4.0/)\n\n`,
	ccbysa           : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC BY-SA 4.0](https://creativecommons.org/publicdomain/by-sa/4.0/)\n\n`,
	ccbync           : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC BY-NC 4.0](https://creativecommons.org/publicdomain/by-nc/4.0/)\n\n`,
	ccbyncsa         : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC BY-NC-SA](https://creativecommons.org/publicdomain/by-nc-sa/4.0/)\n\n`,
	ccbynd           : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC BY-ND 4.0](https://creativecommons.org/publicdomain/by-nd/4.0/)\n\n`,
	ccbyncnd         : `<i class="far fa-copyright"></i> \<year\> This work is openly licensed via [CC NY-NC-ND 4.0](https://creativecommons.org/publicdomain/by-nc-nd/4.0/)\n\n`,
	cczeroBadge      : `![CC0](http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)`,
	ccbyBadge        : `![CC BY](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg)`,
	ccbysaBadge      : `![CC BY-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg)`,
	ccbyncBadge      : `![CC BY-NC](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc.svg)`,
	ccbyncsaBadge    : `![CC BY-NC-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg)`,
	ccbyndBadge      : `![CC BY-ND](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nd.svg)`,
	ccbyncndBadge    : `![CC BY-NC-ND](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-nd.svg)`,
	oseBlack         : `![Old School Essentials Black Logo](/assets/license_logos/Designed_For_Use_With_Old-School_Essentials_-_Black.png){width:200px}`,
	oseWhite         : `![Old School Essentials White Logo](/assets/license_logos/Designed_For_Use_With_Old-School_Essentials_-_White.png){width:200px}`,
	oseNotice        : `Old-School Essentials is a trademark of Necrotic Gnome. The trademark and Old-School Essentials logo are used with permission of Necrotic Gnome, under license”.`,
	shadowDarkNotice : `\[Product Name]\ is an independent product published under the Shadowdark RPG Third-Party License and is not affiliated with The Arcane Library, LLC. Shadowdark RPG © 2023 The Arcane Library, LLC.`,
	shadowDarkBlack  : `![Shadowdark Black Logo](/assets/license_logos/Third_Party_Shadowdark_Logo_Black.png){width:200px}`,
	shadowDarkWhite  : `![Shadowdark White Logo](/assets/license_logos/Third_Party_Shadowdark_Logo_White.png){width:200px}`,
	bladesDarkNotice : `This work is based on Blades in the Dark \(found at (http://www.bladesinthedark.com/)\), product of One Seven Design, developed and authored by John Harper, and licensed for our use under the Creative Commons Attribution 3.0 Unported license \(http://creativecommons.org/licenses/by/3.0/\).`,
	bladesDarkLogo   : `![Forged in the Dark](/assets/license_logos/forged_in_the_dark_logo2_0.png)`,
	bladesDarkLogoAttribution : `*Blades in the Dark^tm^ is a trademark of One Seven Design. The Forged in the Dark Logo is © One Seven Design, and is used with permission.*`
};
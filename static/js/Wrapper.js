"use strict";

class Wrapper extends Component {
  constructor(props) {
    super(props);
  }
  render(props, state) {
    return (
      h('div', {id:'Wrapper'},
        h(Header, null),
        h(Intro, null),
        h(MePhoto, null),
        h(SubIntro, null),
        h(Professional, null),
        h(Personal, null),
        h(Footer, null)
      )
    )
  }
}

function Header (props) {
  return (
    h('div', {id:"Header"},
      h('div', {id:"Bar"},
        h('div', {className:"item"},
          h('a', {href:"#Professional"}, 'my work')
        ),
        h('div', {className:"item"},
          h('a', {href:"#Personal"}, 'my life')
        )
      )
    )
  )
}

function Intro (props) {
  return (
    h('div', {id:'intro'},
      h('img', {src: '/static/img/eclipse.jpg', id:'Hero'}),
      h('div', {id: "HeroText"},
        h('div', {id:'Title'}, 'NICK JENSEN'),
        h('div', {id:'Subtitle'}, 'professional website')
      )
    )
  )
}

function MePhoto (props) {
  return (
    h('div', {id: 'MePhoto'},
      h('img', {src: '/static/img/nick.jpg'})
    )
  )
}

function SubIntro (props) {
  return (
    h('div', {id: "SubIntro"},
      h('div', {id: "Title"}, "I\'m a creator"),
      h('div', {id: "Subtitle"},
        h('div', {className: "item"},
          h('span', null, "Developer"),
          h('img', {src: '/static/img/python.svg'})
        ),
        h('div', {className: "item"},
          h('span', null, "Researcher"),
          //h('img', {src: '/static/img/DNA-Helix-Variation-2.svg'})
          h('img', {src: '/static/img/beaker.png'})
        ),
        h('div', {className: "item"},
          h('span', null, "Chainmail Artist"),
          h('img', {src: '/static/img/dragonscaleSquare.png'})
        )
      )
    )
  )
}

function Professional (props) {
  const items = proContent.map(elem=>ProfessionalItem(elem));
  return (
    h('div', {id: 'Professional'},
      h('span', {className: 'BodyTitle'}, 'Professional Background'),
      items
    )
  )
}

function ProfessionalItem (props) {
  const {iconSrc, timeStr, title, subtitle, subsubtitle, description, ref} = props;
  // TODO handle ref
  return (
    h('div', {className: 'ProItem'},
      h('div', {className: "ProIcon"},
        // TODO: add a default icon
        iconSrc ? h('img', {src: iconSrc}) : null
      ),
      h('div', {className: 'ProTimeframe'},
        h('span', null, timeStr)
      ),
      h('div', {className: 'ProText'},
        h('span', {id: 'title'}, title),
        h('span', {id: 'subtitle'}, subtitle),
        h('span', {id: 'subsubtitle'}, subsubtitle),
        h('span', {id: 'description'}, description),
      )
    )
  )
}

function Personal (props) {
  return (
    h('div', {id: 'Personal'},
      h('span', {className: 'BodyTitle'}, 'About Me'),
      h('div', {id: 'PersonalContent'},
        h('div', {id: "PersonalPhoto"},
          h('img', {src:"/static/img/sitting.jpg"})
        ),
        h('div', {id: 'PersonalParagraph'},
          h('span', null, 'Yeah, I know this is the most important part of my website to get right. Someday I will write a paragraph about myself. Until then, I\'ll keep working on my projects.'),
        ),
        h('div', {id: 'PersonalLinks'},
          h('a', {href:"http://github.com/discolemur"},
            h('span', null, 'See my work'),
            h('img', {src: '/static/img/GitHub-Mark-64px.png'})
          ),
          h('div', {id:"github-badge"}),
          h('a', {href:"http://www.linkedin.com/in/nick-jensen-92261413a"},
            h('span', null, 'View my profile'),
            h('img', {src: "/static/img/In-2C-41px-R.png"})
          )
        )
      )
    )
  )
}

function Footer (props) {
  return (
    h('div', {id:'Footer'},
      h('p', null, '© 2018 Nick Jensen — Hosted on GitHub Pages'),
      h('div', null, 
        h('span', {id:'credits'},'Icon made from ',
          h('a', {href:"http://www.onlinewebfonts.com/icon"}, 'Icon Fonts'),
          h('span', null, ' (the flask in the intro section) is licensed by CC BY 3.0')
        )
      )
    )
  )
}

render(h(Wrapper), document.getElementById('Main'));
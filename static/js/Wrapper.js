"use strict";

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  };
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };
  handleScroll(event) {
    console.log('the scroll things', event)
  };
  render(props, state) {
    return (
      h('div', {id:'Wrapper'},
        // Paralax Images
        h(ParalaxImages, null),
        h(Header, null),
        h(Intro, null),
          h(MePhoto, null),
          h(SubIntro, null),
          h(Professional, null),
          // this is where I really want the eclipse picture to slide through.
          h(Invisible, {height: '10rem', maxHeight: '40%'}),
          h(Personal, null),
          h(Footer, null)
      )
    )
  }
}

function ParalaxImages (props) {
  return (
    h('div', null,
      h('img', {src: '/static/img/eclipse.jpg', id:'Hero', className: 'Paralax set'}),
      h('img', {src: '/static/img/heroBackground.jpg', id:'Hero', className: 'Paralax unset'})
    )
  )
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
      h(Scroll3D, {items: personalScrollItems})
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
  const iconSrc = props.iconSrc;
  const timeStr = props.timeStr;
  const title = props.title;
  const subtitle = props.subtitle;
  const subsubtitle = props.subsubtitle;
  const description = props.description;
  const ref = props.ref;
  const subtitleDOM = h('span', {id: 'subtitle'}, subtitle);
  const subtitleLinkDOM = ref && subtitle ? h('a', {href: ref, id: 'subtitle'}, subtitle) : subtitleDOM;
  const titleDOM = h('span', {id: 'title'}, title);
  const titleLinkDOM = h('a', {href: ref, id: 'title'}, title);
  const descriptionDOM = description.split('\n').map(part=>{
    return h('span', {id: 'description'}, part)
  })
  return (
    h('div', {className: 'ProItem'},
      h('div', {className: "ProIcon"},
        iconSrc ? h('img', {src: iconSrc}) : null
      ),
      h('div', {className: 'ProTimeframe'},
        h('span', null, timeStr)
      ),
      h('div', {className: 'ProText'},
        subtitle ? titleDOM : titleLinkDOM,
        subtitle ? subtitleLinkDOM : null,
        subsubtitle ? h('span', {id: 'subsubtitle'}, subsubtitle) : null,
        descriptionDOM
      )
    )
  )
}

function Invisible(props) {
  return h('div', {id: 'Invisible', style: `height: ${props.height}; max-height: ${props.maxHeight};`});
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
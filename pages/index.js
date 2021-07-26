import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSideBar(propriedades){
  return (
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}></img>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}

        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (

    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((item) =>{ 
          return (
            <li key={item.login}>
              <a href={`/users/${item.login}`}>
                <img src={`https://github.com/${item.login}.png`} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuario = 'raphaeldoratiottocamargo';
  const [comunidades, setComunidades] = React.useState([]);
  //   id: new Date().toISOString(),
  //   title:'Eu odeio acordar cedo',
  //   image:'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  // }]);
  
  const pessoasFavoritas = [
    'gabsferreira', 
    'omariosouto',
    'peas',
    'guilhermesilveira',
    'lucasmontano',
    'filipedeschamps',
    'diego3g'
  ]

  const [seguidores, setSeguidores] = React.useState([]);
  const token = '27fc27aa8093f7a6141dece9ec18e0';

  React.useEffect(function(){
    //GET
    fetch('https://api.github.com/users/raphaeldoratiottocamargo/followers')
    .then(function(respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta){
      setSeguidores(respostaCompleta);
    })

    //API GraphQL, POST pra enviar a query em GraphQL
    fetch('https://graphql.datocms.com/', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`
      })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesVindasDoDato);
    })
  }, []) 

  return (
    <>
    <AlurakutMenu githubUser={usuario}/>
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSideBar githubUser={usuario}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem vindo(a)
          </h1>

          <OrkutNostalgicIconSet />
        </Box>
      <Box>
        <h2 className="subTitle">O que você deseja fazer?</h2>
        <form onSubmit={function handleCriaComunidade(e){
          e.preventDefault();

          const dadosDoForm = new FormData(e.target);
          console.log(dadosDoForm.get('title'));
          console.log(dadosDoForm.get('image'));

          const comunidade = {
            title: dadosDoForm.get('title'),
            imageUrl: dadosDoForm.get('image'),
            creatorSlug: usuario
          }
          
          fetch('/api/comunidades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(comunidade)
          })
          .then(async (response) => {
            const dados = await response.json();
            console.log(dados.registroCriado);
            const comunidade = dados.registroCriado;
            const comunidadesAtualizadas = [...comunidades, comunidade];
            setComunidades(comunidadesAtualizadas)
          })

        }}>
          <div>
            <input 
              placeholder="Qual vai ser o nome da sua comunidade?" 
              name="title"
              aria-label="Qual vai ser o nome da sua comunidade?"
              type="text"
            />
          </div>
          <div>
            <input 
              placeholder="Coloque uma URL para usarmos de capa" 
              name="image"
              aria-label="Coloque uma URL para usarmos de capa"
            />
          </div>

          <button>
            Criar comunidade
          </button>
        </form>
      </Box>

      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        
        <ProfileRelationsBox title="Seguidores" items={seguidores}/>
        
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.slice(0, 6).map((nome) =>{ 
              return (
                <li key={nome}>
                  <a href={`/users/${nome}`}>
                    <img src={`https://github.com/${nome}.png`} />
                    <span>{nome}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
          <ul>
            {comunidades.slice(0, 6).map((comunidade) =>{ 
              return (
                <li key={comunidade.id}>  
                  <a href={`/communities/${comunidade.id}`}>
                    <img src={comunidade.imageUrl} />
                    <span>{comunidade.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

      </div>
    </MainGrid>
    </>
  )
}

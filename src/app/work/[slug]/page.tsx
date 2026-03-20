export function generateStaticParams(){return[];}
export default async function CaseStudy({params}:{params:Promise<{slug:string}>}){
  const{slug}=await params;
  return(<main style={{background:"#05050A",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#F1F2FF",fontFamily:"system-ui"}}><div style={{textAlign:"center"}}><div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.2em",color:"#2F7EFF",marginBottom:16}}>CASE STUDY</div><h1 style={{fontSize:"clamp(36px,6vw,80px)",fontWeight:900,letterSpacing:"-.03em",marginBottom:16,textTransform:"capitalize"}}>{slug.replace(/-/g," ")}</h1><p style={{color:"#5C6278",fontSize:14,marginBottom:28}}>Full case study — next generation.</p><a href="/work" style={{color:"#2F7EFF",fontSize:11,fontFamily:"monospace",letterSpacing:"0.14em"}}>← WORK</a></div></main>);
}

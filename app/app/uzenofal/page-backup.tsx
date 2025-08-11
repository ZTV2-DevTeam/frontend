'use client';

import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Pin, 
  MessageCircle, 
  Share2, 
  Filter,
  Calendar,
  User,
  Building,
  BellDot,
  Plus,
  Megaphone
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useApiQuery } from "@/lib/api-helpers";
import { AnnouncementSchema, AnnouncementDetailSchema } from "@/lib/types";
import { apiClient } from "@/lib/api";

export default function MessageBoardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  
  // Fetch data from API
  const { data: announcements = [], loading, error } = useApiQuery(
    () => apiClient.getAnnouncements()
  )

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center">Betöltés...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center text-red-500">
              Hiba történt az adatok betöltésekor: {error}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const announcementsArray = announcements as AnnouncementSchema[]

  // Filter announcements based on search and category
  const filteredAnnouncements = announcementsArray.filter(announcement => {
    const matchesSearch = searchTerm === "" || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.body.toLowerCase().includes(searchTerm.toLowerCase())
    
    // For category filtering, we can use is_targeted or other properties
    const matchesCategory = categoryFilter === "all" || 
      (categoryFilter === "targeted" && announcement.is_targeted) ||
      (categoryFilter === "public" && !announcement.is_targeted)
    
    return matchesSearch && matchesCategory
  })

  // Sort by creation date, most recent first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Most'
    } else if (diffInHours < 24) {
      return `${diffInHours} órája`
    } else {
      return date.toLocaleDateString('hu-HU', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getCategoryBadge = (announcement: AnnouncementSchema) => {
    if (announcement.is_targeted) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Célzott</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Nyilvános</Badge>
    }
  }
    id: 1,
    title: "📢 Fontos: Új Biztonsági Protokoll",
    content: `# Új Biztonsági Intézkedések

A **2025. augusztus 15-től** életbe lépő új biztonsági protokoll:

## Főbb változások:
- ✅ Kötelező védőfelszerelés minden forgatáson
- ✅ Új regisztrációs folyamat külső személyeknek
- ✅ Biztonsági briefing minden projekt előtt

### Szükséges dokumentumok:
| Dokumentum | Határidő | Felelős |
|------------|----------|---------|
| Biztonsági képzés | 2025.08.20 | Minden munkatárs |
| Egészségügyi igazolás | 2025.08.25 | HR osztály |
| Felszerelés ellenőrzés | 2025.08.30 | Műszaki vezető |

> **Fontos:** A protokoll be nem tartása munkavállalói felelősségre vonással jár.

További információk: [Biztonsági szabályzat](https://ztv.hu/biztonsag)`,
    author: "Szabó Péter",
    department: "Biztonsági Osztály",
    timestamp: "2025-08-11 08:30",
    category: "urgent",
    pinned: true,
    isRead: false,
    avatar: "SP",
    comments: [
      {
        id: 1,
        author: "Nagy Anna",
        content: "Mikor lesz a következő biztonsági képzés?",
        timestamp: "2025-08-11 09:15",
        avatar: "NA"
      }
    ]
  },
  {
    id: 2,
    title: "🎬 Forgatási Ütemterv - Augusztus",
    content: `## Augusztusi Forgatások

### Hétvégén zajló projektek:

**Augusztus 17-18 (Szombat-Vasárnap)**
- 🎥 **"Múlt Nyomában"** - Dokumentumfilm
- 📍 Helyszín: Váci Duna-part
- ⏰ 06:00 - 18:00
- 👥 Stáb létszám: 8 fő

**Augusztus 24-25 (Szombat-Vasárnap)**  
- 🎭 **"Örökség"** - Rövidfilm
- 📍 Helyszín: Szentendre, Szabadtéri Múzeum
- ⏰ 07:00 - 20:00
- 👥 Stáb létszám: 12 fő

### TODO lista a forgatásokra:
- [ ] Kamerafelszerelés ellenőrzése
- [ ] Catering megszervezése
- [ ] Parkolási engedélyek beszerzése
- [x] Helyszín bejárás elvégzése
- [ ] Statiszták értesítése

**Jelentkezés:** Kérjük jelezzétek részvételi szándékotokat a forgatásvezetőknél! 📧`,
    author: "Kiss Tamás",
    department: "Produkciós Osztály",
    timestamp: "2025-08-11 07:45",
    category: "shooting",
    pinned: false,
    isRead: true,
    avatar: "KT",
    comments: [
      {
        id: 2,
        author: "Molnár Zita",
        content: "A váci forgatásra még van hely?",
        timestamp: "2025-08-11 08:20",
        avatar: "MZ"
      },
      {
        id: 3,
        author: "Horváth Gábor",
        content: "Szentendrére szívesen mennék operatőrnek!",
        timestamp: "2025-08-11 08:45",
        avatar: "HG"
      }
    ]
  },
  {
    id: 3,
    title: "💼 Közbeszerzési Pályázat - Technikai Felszerelés",
    content: `# Közbeszerzési Felhívás
## Technikai Eszközök Beszerzése

**Pályázat azonosító:** ZTV-2025-TECH-001  
**Beadási határidő:** 2025. szeptember 15. 17:00

### Beszerzendő eszközök:

#### Kamerák és objektívek:
1. **Professzionális kamerák** (3 db)
   - 4K felbontás minimum
   - LOG recording képesség
   - Dual card slot
   - Becsült érték: ~15M HUF

2. **Objektív készlet** (teljes)
   - Prime lencsék 24mm, 35mm, 50mm, 85mm
   - Zoom objektív 24-70mm f/2.8
   - Becsült érték: ~8M HUF

#### Audio eszközök:
- Wireless mikrofonok (10 db)
- Boom mikrofonok (3 db)  
- Audio mixer (1 db)
- Becsült érték: ~3M HUF

### Pályázati feltételek:
- ✔️ Legalább 3 év garancia
- ✔️ Helyszíni szerviz biztosítás
- ✔️ Képzés a munkatársaknak
- ✔️ Referenciák megadása kötelező

**Kapcsolattartó:** Varga Eszter (eszter.varga@ztv.hu)  
**Telefon:** +36 1 234 5678

---

*A pályázat részletes feltételeit a [honlapunkon](https://ztv.hu/tender) találják.*`,
    author: "Varga Eszter",
    department: "Beszerzési Osztály",
    timestamp: "2025-08-10 14:22",
    category: "tender",
    pinned: false,
    isRead: false,
    avatar: "VE",
    comments: []
  },
  {
    id: 4,
    title: "🏆 Sikeres Filmfesztivál Részvétel",
    content: `## Fantasztikus Eredmények! 🎉

Nagy örömmel jelentjük, hogy a **"Csendes Vizek"** című filmünk:

### Díjak és elismerések:
- 🥇 **Legjobb Operatőr díj** - Kovács Miklós
- 🥈 **Különdíj a legjobb hangért** - Balogh Rita  
- 🏅 **Közönségdíj** - 2. helyezés

### Fesztivál statisztikák:
- **122** film indult a versenyben
- **18** országból érkeztek alkotások
- **~2000** néző szavazott a közönségdíjnál

**Gratulálunk** az egész stábnak! 👏

A következő célunk a **Cannes-i Filmfesztivál** - jelentkezési határidő november 30.

---

*A díjkiosztó gálán készült fotók hamarosan elérhetők lesznek a belső galériában.*`,
    author: "Dr. Tóth Katalin",
    department: "Igazgatóság",
    timestamp: "2025-08-09 16:15",
    category: "announcement",
    pinned: false,
    isRead: true,
    avatar: "TK",
    comments: [
      {
        id: 4,
        author: "Kovács Miklós",
        content: "Köszönöm a gratuláció! Csapatmunka volt! 🙏",
        timestamp: "2025-08-09 17:30",
        avatar: "KM"
      }
    ]
  },
  {
    id: 5,
    title: "☕ Csapatépítő Program - Augusztus 30.",
    content: `# Csapatépítő Nap! 🎉

**Időpont:** 2025. augusztus 30. (péntek)  
**Helyszín:** Visegrád, Bobpálya és Adventure Park  
**Indulás:** 09:00 (ZTV parkoló)

## Program:
- **09:00 - 10:00** Utazás busszal ☁️
- **10:00 - 12:00** Bobpálya verseny 🛷
- **12:00 - 13:30** Ebéd a Duna-parton 🍽️
- **13:30 - 16:00** Adventure park kihívások 🌲
- **16:00 - 17:00** Visszaút 🚌

### Jelentkezés:
Kérjük jelezzétek **augusztus 20-ig** a HR-nél!

**Részvételi díj:** 5.000 Ft/fő (ebéd + program)  
**Létszám korlát:** 30 fő

> Ez egy remek alkalom, hogy jobban megismerjük egymást a munkahelyi környezeten kívül is! 😊

**Kapcsolat:** hr@ztv.hu vagy Szabó Judit (123-as mellék)`,
    author: "Szabó Judit",
    department: "HR Osztály", 
    timestamp: "2025-08-08 11:10",
    category: "general",
    pinned: false,
    isRead: true,
    avatar: "SJ",
    comments: [
      {
        id: 5,
        author: "Papp László",
        content: "Szuper program! Már jelentkeztem is 🚀",
        timestamp: "2025-08-08 12:45",
        avatar: "PL"
      }
    ]
  }
];

// Custom markdown components with theme support
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 border-b pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 mt-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-medium mb-2 mt-3">
              {children}
            </h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed">
              {children}
            </p>
          ),
          // Strong/Bold text
          strong: ({ children }) => (
            <strong className="font-semibold">
              {children}
            </strong>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">
              {children}
            </ol>
          ),
          // Task lists
          li: ({ children, className }) => {
            const isTaskList = className?.includes('task-list-item');
            return (
              <li className={`${isTaskList ? 'list-none flex items-center gap-2' : ''}`}>
                {children}
              </li>
            );
          },
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-medium border-b">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b">
              {children}
            </td>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/20 pl-4 py-2 mb-3 bg-muted/50 rounded-r">
              <div className="italic">
                {children}
              </div>
            </blockquote>
          ),
          // Code
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3">
                <code className="text-sm font-mono">
                  {children}
                </code>
              </pre>
            );
          },
          // Horizontal rule
          hr: () => (
            <hr className="border-border my-4" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const getCategoryColor = (category: Post['category']) => {
  switch (category) {
    case 'urgent': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
    case 'announcement': return 'bg-primary/10 text-primary hover:bg-primary/20';
    case 'shooting': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20';
    case 'tender': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20';
    case 'general': return 'bg-muted text-muted-foreground hover:bg-muted/80';
    default: return 'bg-muted text-muted-foreground hover:bg-muted/80';
  }
};

const getCategoryLabel = (category: Post['category']) => {
  switch (category) {
    case 'urgent': return 'Sürgős';
    case 'announcement': return 'Közlemény';
    case 'shooting': return 'Forgatás';
    case 'tender': return 'Pályázat';
    case 'general': return 'Általános';
    default: return 'Egyéb';
  }
};

export default function MessageWallPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !post.isRead) ||
                         (selectedFilter === 'urgent' && post.category === 'urgent');
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Pinned posts first, then by timestamp
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const markAsRead = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isRead: true } : post
    ));
  };

  const unreadCount = posts.filter(post => !post.isRead).length;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <BellDot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Üzenőfal</CardTitle>
                  <CardDescription>Céges hírek, közlemények és információk</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Keresés a bejegyzések között..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('all')}
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Összes
                  </Button>
                  <Button
                    variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('unread')}
                    className="whitespace-nowrap"
                  >
                    Olvasatlan {unreadCount > 0 && <Badge className="ml-2" variant="secondary">{unreadCount}</Badge>}
                  </Button>
                  <Button
                    variant={selectedFilter === 'urgent' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('urgent')}
                    className="whitespace-nowrap"
                  >
                    Sürgős
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nincs találat a keresési feltételeknek megfelelően.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className={`transition-all hover:shadow-md ${
                    post.pinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  } ${
                    !post.isRead ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/avatars/${post.avatar}.png`} />
                          <AvatarFallback className="bg-muted">
                            {post.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-semibold truncate">
                              {post.title}
                            </h2>
                            {post.pinned && <Pin className="h-4 w-4 text-primary" />}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                            <span>•</span>
                            <Building className="h-3 w-3" />
                            <span>{post.department}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(post.category)}
                        >
                          {getCategoryLabel(post.category)}
                        </Badge>
                        {!post.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div 
                      className="cursor-pointer"
                      onClick={() => !post.isRead && markAsRead(post.id)}
                    >
                      <MarkdownRenderer content={post.content} />
                    </div>

                    {/* Comments */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments.length} hozzászólás</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" disabled>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Hozzászólás
                          </Button>
                          <Button variant="ghost" size="sm" disabled>
                            <Share2 className="h-4 w-4 mr-1" />
                            Megosztás
                          </Button>
                        </div>
                      </div>

                      {/* Comments Display */}
                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/${comment.avatar}.png`} />
                                <AvatarFallback className="bg-muted text-xs">
                                  {comment.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Disabled Notice */}
                      <div className="mt-3 text-center">
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          Hozzászólások és megosztás letiltva
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
